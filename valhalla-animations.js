import * as THREE from 'https://esm.sh/three@0.160.0';

/**
 * Optional explicit node-name overrides if valhalla-bot.glb uses custom names
 * that do not match standard skeletal/group naming patterns.
 * Run `window.__VALHALLA_RIG__.dumpTree()` in the browser console to inspect names.
 */
export const RIG_OVERRIDES = {
  head: null,
  neck: null,
  torso: null,
  spear: null,
  beard: null,
  eyes: null, // e.g. ['Eye_L', 'Eye_R']
  brows: null,
  faceMeshes: null,
  leftArm: { shoulder: null, upperArm: null, forearm: null, hand: null, fingers: null },
  rightArm: { shoulder: null, upperArm: null, forearm: null, hand: null, fingers: null },
  debugLog: false,
};

// Shared scratch math objects to prevent GC stalls during animation loops
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _v4 = new THREE.Vector3();
const _v5 = new THREE.Vector3();
const _q1 = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _q3 = new THREE.Quaternion();
const _q4 = new THREE.Quaternion();
const _e1 = new THREE.Euler();
const _m1 = new THREE.Matrix4();
const _m2 = new THREE.Matrix4();

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function easeInOutCubic(t) {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutBack(t, s = 1.35) {
  const x = clamp(t, 0, 1) - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
}

function getRelativeMatrix(child, ancestor) {
  const result = new THREE.Matrix4();
  ancestor.updateMatrixWorld(true);
  child.updateMatrixWorld(true);
  result.copy(ancestor.matrixWorld).invert().multiply(child.matrixWorld);
  return result;
}

function deduplicateRoots(nodes) {
  const set = new Set(nodes);
  return nodes.filter((node) => {
    let p = node.parent;
    while (p) {
      if (set.has(p)) return false;
      p = p.parent;
    }
    return true;
  });
}

function measureObjectBoxInSpace(rootNode, targetSpaceNode, excludeSet = null) {
  const box = new THREE.Box3();
  const invTarget = new THREE.Matrix4();
  targetSpaceNode.updateMatrixWorld(true);
  invTarget.copy(targetSpaceNode.matrixWorld).invert();

  const relMat = new THREE.Matrix4();
  const tmpBox = new THREE.Box3();
  let found = false;

  rootNode.traverse((obj) => {
    if (excludeSet && excludeSet.has(obj)) return;
    if (!obj.isMesh || !obj.geometry) return;
    let p = obj.parent;
    while (p) {
      if (excludeSet && excludeSet.has(p)) return;
      p = p.parent;
    }
    if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
    if (!obj.geometry.boundingBox || obj.geometry.boundingBox.isEmpty()) return;

    obj.updateMatrixWorld(true);
    relMat.copy(invTarget).multiply(obj.matrixWorld);
    tmpBox.copy(obj.geometry.boundingBox).applyMatrix4(relMat);
    box.union(tmpBox);
    found = true;
  });

  return found ? box : null;
}

/**
 * Inspects the loaded GLB scene graph, skeleton bones, morph targets, and meshes.
 */
export function inspectValhallaRig(model, gltf = null, explicitRefs = {}) {
  model.updateMatrixWorld(true);

  const allNodes = [];
  const bones = [];
  const meshes = [];
  const skinnedMeshes = [];
  const morphBindings = {
    eyeWide: [],
    browUp: [],
    surprise: [],
    mouthOpen: [],
  };

  model.traverse((obj) => {
    allNodes.push(obj);
    if (obj.isBone) bones.push(obj);
    if (obj.isMesh) {
      meshes.push(obj);
      if (obj.isSkinnedMesh) skinnedMeshes.push(obj);
      if (obj.morphTargetDictionary && obj.morphTargetInfluences) {
        for (const [key, idx] of Object.entries(obj.morphTargetDictionary)) {
          if (/eye.*wide|wide.*eye|eyes?open/i.test(key)) morphBindings.eyeWide.push({ mesh: obj, index: idx, key });
          if (/brow.*up|inner.*up|outer.*up|eyebrow.*raise/i.test(key)) morphBindings.browUp.push({ mesh: obj, index: idx, key });
          if (/surprise|shock|amaze/i.test(key)) morphBindings.surprise.push({ mesh: obj, index: idx, key });
          if (/jaw.*open|mouth.*open/i.test(key)) morphBindings.mouthOpen.push({ mesh: obj, index: idx, key });
        }
      }
    }
  });

  const findByOverride = (nameOrList) => {
    if (!nameOrList) return null;
    if (Array.isArray(nameOrList)) {
      return nameOrList.map((n) => model.getObjectByName(n)).filter(Boolean);
    }
    return model.getObjectByName(nameOrList) || null;
  };

  const findBest = (patterns, filter = () => true) => {
    const candidates = [...bones, ...allNodes];
    for (const pattern of patterns) {
      const matches = candidates.filter((node) => node !== model && node.name && pattern.test(node.name) && filter(node));
      if (matches.length) {
        matches.sort((a, b) => {
          const score = (n) => (n.isBone ? 0 : !n.isMesh ? 1 : 2);
          return score(a) - score(b);
        });
        return matches[0];
      }
    }
    return null;
  };

  const head =
    findByOverride(RIG_OVERRIDES.head) ||
    explicitRefs.headGroup ||
    findBest([/^headgroup$/i, /^mixamorig.*head$/i, /^head$/i, /\bhead\b/i]);

  const neck =
    findByOverride(RIG_OVERRIDES.neck) ||
    explicitRefs.neckGroup ||
    findBest([/^neckgroup$/i, /^mixamorig.*neck$/i, /^neck$/i, /\bneck\b/i], (n) => n !== head);

  const torso =
    findByOverride(RIG_OVERRIDES.torso) ||
    findBest(
      [
        /upper.?chest/i,
        /chest/i,
        /spine.?0?2/i,
        /spine.?0?1/i,
        /^spine$/i,
        /torso/i,
        /upper.?body/i,
        /^bodygroup$/i,
        /^body$/i,
      ],
      (n) => n !== head && n !== neck
    );

  function resolveArmSide(side) {
    const ov = RIG_OVERRIDES[`${side}Arm`] || {};
    const sideRegex =
      side === 'left'
        ? /(?:^|[_\s.-]|mixamorig)(?:left|l)(?:[_\s.-]|(?=[A-Z]))|(?:\.l$|_l$)/i
        : /(?:^|[_\s.-]|mixamorig)(?:right|r)(?:[_\s.-]|(?=[A-Z]))|(?:\.r$|_r$)/i;

    const excludeArmor = (n) => !/armor|pauldron|shield|raven|feather|collar|fur|spear|gungnir/i.test(n.name) && n !== torso;

    const shoulder =
      findByOverride(ov.shoulder) ||
      findBest([/clavicle/i, /collar.?bone/i, /shoulder/i], (n) => sideRegex.test(n.name) && excludeArmor(n));

    const upperArm =
      findByOverride(ov.upperArm) ||
      findBest(
        [/upper.?arm(?!or)/i, /arm(?!or)[_\s.-]?(?:upper|top)/i, /mixamorig.*arm$/i, /bicep/i, /\barm(?!or)\b/i],
        (n) => sideRegex.test(n.name) && excludeArmor(n) && n !== shoulder
      );

    const forearm =
      findByOverride(ov.forearm) ||
      findBest(
        [/fore.?arm(?!or)/i, /lower.?arm(?!or)/i, /elbow/i],
        (n) => sideRegex.test(n.name) && excludeArmor(n) && n !== upperArm
      );

    const hand =
      findByOverride(ov.hand) ||
      findBest(
        [/hand(?!le)/i, /wrist/i, /palm/i],
        (n) => sideRegex.test(n.name) && excludeArmor(n) && n !== forearm
      );

    let fingers = findByOverride(ov.fingers) || [];
    if (!fingers.length && hand) {
      const fList = [];
      hand.traverse((child) => {
        if (child !== hand && /finger|thumb|index|middle|ring|pinky|digit|knuckle/i.test(child.name)) {
          fList.push(child);
        }
      });
      fingers = deduplicateRoots(fList);
    }

    const rest = {};
    if (upperArm) {
      const pS = upperArm.getWorldPosition(new THREE.Vector3());
      const pE = forearm ? forearm.getWorldPosition(new THREE.Vector3()) : hand ? hand.getWorldPosition(new THREE.Vector3()) : null;
      const pH = hand ? hand.getWorldPosition(new THREE.Vector3()) : null;

      if (pE) {
        rest.upperLength = pS.distanceTo(pE);
        rest.upperLocalDir = upperArm.worldToLocal(pE.clone()).normalize();
      }
      if (forearm && pH) {
        rest.forearmLength = pE.distanceTo(pH);
        rest.forearmLocalDir = forearm.worldToLocal(pH.clone()).normalize();
      } else if (upperArm && pH && !forearm) {
        rest.upperLength = pS.distanceTo(pH);
        rest.upperLocalDir = upperArm.worldToLocal(pH.clone()).normalize();
      }

      if (hand) {
        if (fingers.length) {
          const avgFingerWorld = new THREE.Vector3();
          fingers.forEach((f) => avgFingerWorld.add(f.getWorldPosition(new THREE.Vector3())));
          avgFingerWorld.divideScalar(fingers.length);
          const localAim = hand.worldToLocal(avgFingerWorld.clone());
          rest.handForwardLocal = localAim.lengthSq() > 1e-6 ? localAim.normalize() : new THREE.Vector3(0, 1, 0);
        } else {
          rest.handForwardLocal = new THREE.Vector3(0, 1, 0);
        }
        rest.gripOffsetLocal = new THREE.Vector3(0, (rest.forearmLength || 0.25) * 0.14, 0);
      }
    }

    return { side, shoulder, upperArm, forearm, hand, fingers, rest };
  }

  const leftArm = resolveArmSide('left');
  const rightArm = resolveArmSide('right');

  let spear =
    findByOverride(RIG_OVERRIDES.spear) ||
    findBest([/gungnir/i, /spear/i, /lance/i, /halberd/i, /javelin/i, /pike/i, /polearm/i, /staff/i, /weapon/i]);

  if (!spear) {
    const totalBox = new THREE.Box3().setFromObject(model);
    const totalHeight = totalBox.getSize(new THREE.Vector3()).y || 1.94;
    let bestScore = 0;
    for (const m of meshes) {
      if (m.isSkinnedMesh) continue;
      if (head && (m === head || head.children.includes(m))) continue;
      if (!m.geometry) continue;
      const b = new THREE.Box3().setFromObject(m);
      const sz = b.getSize(new THREE.Vector3());
      const dims = [sz.x, sz.y, sz.z].sort((a, bVal) => bVal - a);
      const longest = dims[0];
      const thickness = Math.max(dims[1], 1e-4);
      const aspect = longest / thickness;
      if (longest >= totalHeight * 0.52 && aspect >= 5.5 && aspect > bestScore) {
        bestScore = aspect;
        spear = m;
      }
    }
  }

  let spearMeta = null;
  if (spear) {
    model.updateMatrixWorld(true);
    const spearLocalBox = new THREE.Box3();
    spear.traverse((child) => {
      if (!child.isMesh || !child.geometry) return;
      if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
      if (!child.geometry.boundingBox) return;
      const rel = getRelativeMatrix(child, spear);
      spearLocalBox.union(child.geometry.boundingBox.clone().applyMatrix4(rel));
    });

    if (!spearLocalBox.isEmpty()) {
      const sz = spearLocalBox.getSize(new THREE.Vector3());
      const center = spearLocalBox.getCenter(new THREE.Vector3());
      let localAxis = new THREE.Vector3(0, 1, 0);
      if (sz.x >= sz.y && sz.x >= sz.z) localAxis.set(1, 0, 0);
      else if (sz.z >= sz.x && sz.z >= sz.y) localAxis.set(0, 0, 1);

      const worldAxis = localAxis.clone().transformDirection(spear.matrixWorld);
      if (worldAxis.y < 0) localAxis.negate();

      const worldGrip = center.clone().applyMatrix4(spear.matrixWorld);
      const modelGrip = model.worldToLocal(worldGrip.clone());

      spearMeta = {
        node: spear,
        isBone: Boolean(spear.isBone),
        restParent: spear.parent,
        restPosition: spear.position.clone(),
        restQuaternion: spear.quaternion.clone(),
        restScale: spear.scale.clone(),
        localShaftAxis: localAxis,
        localGripCenter: center,
        length: Math.max(sz.x, sz.y, sz.z),
        restSide: modelGrip.x < 0 ? 'right' : 'left',
      };
    }
  }

  const beard =
    findByOverride(RIG_OVERRIDES.beard) ||
    findBest([/^beardgroup$/i, /^beard$/i, /beard/i, /mustache/i]);

  const headSearchRoot = head || model;
  let eyes = findByOverride(RIG_OVERRIDES.eyes) || [];
  if (!eyes.length) {
    const rawEyes = [];
    headSearchRoot.traverse((obj) => {
      if (obj === headSearchRoot) return;
      if (/(?:eye(?!brow|lash|lid)|pupil|iris|led)/i.test(obj.name) && !/brow|visor|screen/i.test(obj.name)) {
        rawEyes.push(obj);
      }
    });
    eyes = deduplicateRoots(rawEyes);
  }

  let brows = findByOverride(RIG_OVERRIDES.brows) || [];
  if (!brows.length) {
    const rawBrows = [];
    headSearchRoot.traverse((obj) => {
      if (obj === headSearchRoot) return;
      if (/brow|eyebrow/i.test(obj.name)) rawBrows.push(obj);
    });
    brows = deduplicateRoots(rawBrows);
  }

  let faceMeshes = findByOverride(RIG_OVERRIDES.faceMeshes) || [];
  let useFullFaceMesh = false;
  if (!faceMeshes.length) {
    const eyeSet = new Set(eyes);
    const browSet = new Set(brows);
    const beardSet = beard ? new Set([beard]) : new Set();

    const isInside = (node, set) => {
      let cur = node;
      while (cur) {
        if (set.has(cur)) return true;
        cur = cur.parent;
      }
      return false;
    };

    const headMeshes = [];
    headSearchRoot.traverse((obj) => {
      if (!obj.isMesh) return;
      if (isInside(obj, eyeSet) || isInside(obj, browSet) || isInside(obj, beardSet)) return;
      if (/horn|wing|raven|spear|gungnir|fur|collar|hair|crown|shield/i.test(obj.name)) return;
      headMeshes.push(obj);
    });

    const dedicated = headMeshes.filter((m) => /face|visor|screen|display|head.?skin|skin|mask/i.test(m.name));
    if (dedicated.length) {
      faceMeshes = dedicated;
      useFullFaceMesh = true;
    } else {
      faceMeshes = headMeshes.length ? headMeshes : meshes.slice(0, 1);
      useFullFaceMesh = false;
    }
  } else {
    useFullFaceMesh = true;
  }

  const headRef = head || model;
  const excludeSpearSet = spear ? new Set([spear]) : null;
  const bodyModelBox = measureObjectBoxInSpace(model, model, excludeSpearSet) || new THREE.Box3().setFromObject(model);

  const faceBounds = { center: new THREE.Vector3(0, 0, 0.08), halfSize: new THREE.Vector3(0.18, 0.20, 0.16) };
  if (faceMeshes.length) {
    const headInv = new THREE.Matrix4();
    headRef.updateMatrixWorld(true);
    headInv.copy(headRef.matrixWorld).invert();
    const fBox = new THREE.Box3();
    for (const fm of faceMeshes) {
      if (!fm.geometry) continue;
      if (!fm.geometry.boundingBox) fm.geometry.computeBoundingBox();
      if (!fm.geometry.boundingBox) continue;
      fm.updateMatrixWorld(true);
      const m = headInv.clone().multiply(fm.matrixWorld);
      fBox.union(fm.geometry.boundingBox.clone().applyMatrix4(m));
    }
    if (!fBox.isEmpty()) {
      const sz = fBox.getSize(new THREE.Vector3());
      const ctr = fBox.getCenter(new THREE.Vector3());
      if (useFullFaceMesh) {
        faceBounds.center.copy(ctr);
        faceBounds.halfSize.copy(sz).multiplyScalar(0.52);
      } else {
        let eyeCenterY = ctr.y + sz.y * 0.04;
        if (eyes.length) {
          const eyeBox = new THREE.Box3();
          eyes.forEach((e) => {
            const b = measureObjectBoxInSpace(e, headRef);
            if (b) eyeBox.union(b);
          });
          if (!eyeBox.isEmpty()) {
            eyeCenterY = eyeBox.getCenter(new THREE.Vector3()).y - sz.y * 0.05;
          }
        }
        faceBounds.center.set(ctr.x, eyeCenterY, ctr.z + sz.z * 0.20);
        faceBounds.halfSize.set(sz.x * 0.34, sz.y * 0.32, sz.z * 0.32);
      }
    }
  }

  const restPoses = new Map();
  const trackNode = (node) => {
    if (!node || restPoses.has(node)) return;
    restPoses.set(node, {
      position: node.position.clone(),
      quaternion: node.quaternion.clone(),
      scale: node.scale.clone(),
    });
  };

  [head, neck, torso, beard, ...eyes, ...brows].forEach(trackNode);
  [leftArm, rightArm].forEach((arm) => {
    if (!arm) return;
    [arm.shoulder, arm.upperArm, arm.forearm, arm.hand, ...arm.fingers].forEach(trackNode);
  });

  const eyeMaterials = [];
  eyes.forEach((eyeRoot) => {
    eyeRoot.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;
      obj.material = obj.material.clone();
      eyeMaterials.push({
        material: obj.material,
        emissiveIntensity: obj.material.emissiveIntensity ?? 1,
        opacity: obj.material.opacity ?? 1,
        transparent: Boolean(obj.material.transparent),
      });
    });
  });

  const rig = {
    model,
    head,
    neck,
    torso,
    leftArm,
    rightArm,
    spear: spearMeta,
    beard,
    eyes,
    eyeMaterials,
    brows,
    faceMeshes,
    useFullFaceMesh,
    faceBounds,
    bodyModelBox,
    morphBindings,
    animationsCount: gltf?.animations?.length || 0,
    bonesCount: bones.length,
    meshesCount: meshes.length,
    restPoses,
    capabilities: {
      hasArms: Boolean(leftArm.upperArm || rightArm.upperArm),
      hasBothArms: Boolean(leftArm.upperArm && rightArm.upperArm),
      hasSpear: Boolean(spearMeta),
      hasFaceDisplay: faceMeshes.length > 0,
      hasMorphs: Object.values(morphBindings).some((arr) => arr.length > 0),
      hasEyesOrBrows: eyes.length > 0 || brows.length > 0,
    },
    dumpTree() {
      const lines = [];
      const walk = (n, depth = 0) => {
        const tag = n.isBone ? '[Bone]' : n.isSkinnedMesh ? '[Skinned]' : n.isMesh ? '[Mesh]' : '[Group]';
        const morphs = n.morphTargetDictionary ? ` morphs=[${Object.keys(n.morphTargetDictionary).join(',')}]` : '';
        lines.push(`${'  '.repeat(depth)}${tag} ${n.name || '(unnamed)'}${morphs}`);
        n.children.forEach((c) => walk(c, depth + 1));
      };
      walk(model);
      const output = lines.join('\n');
      console.log(output);
      return output;
    },
    summary() {
      return {
        head: head?.name || null,
        neck: neck?.name || null,
        torso: torso?.name || null,
        leftArm: {
          shoulder: leftArm.shoulder?.name || null,
          upperArm: leftArm.upperArm?.name || null,
          forearm: leftArm.forearm?.name || null,
          hand: leftArm.hand?.name || null,
          fingers: leftArm.fingers.map((f) => f.name),
        },
        rightArm: {
          shoulder: rightArm.shoulder?.name || null,
          upperArm: rightArm.upperArm?.name || null,
          forearm: rightArm.forearm?.name || null,
          hand: rightArm.hand?.name || null,
          fingers: rightArm.fingers.map((f) => f.name),
        },
        spear: spearMeta ? { name: spearMeta.node.name, side: spearMeta.restSide, isBone: spearMeta.isBone, length: +spearMeta.length.toFixed(3) } : null,
        beard: beard?.name || null,
        eyes: eyes.map((e) => e.name),
        brows: brows.map((b) => b.name),
        faceMeshes: faceMeshes.map((m) => m.name),
        useFullFaceMesh,
        bonesCount: bones.length,
        meshesCount: meshes.length,
        gltfAnimations: gltf?.animations?.map((a) => a.name) || [],
        capabilities: this.capabilities,
      };
    },
  };

  if (RIG_OVERRIDES.debugLog) {
    console.info('[ValhallaRig]', rig.summary());
  }

  return rig;
}

/**
 * Analytical 2-bone IK solver driving world-space bone directions independently of bone local axes.
 */
function solveArmIK(arm, targetWorldPos, poleWorldDir, restPoses, blend, fingerCurl = 0) {
  if (!arm || !arm.upperArm || blend <= 0.001) return;

  const upper = arm.upperArm;
  const fore = arm.forearm;
  const hand = arm.hand;
  const restUpper = restPoses.get(upper);
  if (!restUpper) return;

  if (arm.shoulder) {
    const restSh = restPoses.get(arm.shoulder);
    if (restSh) {
      const lift = (arm.side === 'left' ? -1 : 1) * 0.08 * blend;
      _e1.set(0, 0, lift);
      _q1.setFromEuler(_e1).multiply(restSh.quaternion);
      arm.shoulder.quaternion.copy(restSh.quaternion).slerp(_q1, blend);
      arm.shoulder.updateMatrixWorld(true);
    }
  }

  upper.parent.updateMatrixWorld(true);
  const pShoulder = upper.getWorldPosition(_v1);
  const L1 = arm.rest.upperLength || 0.26;
  const L2 = arm.rest.forearmLength || 0.24;

  if (fore) {
    const toTarget = _v2.copy(targetWorldPos).sub(pShoulder);
    const maxReach = (L1 + L2) * 0.992;
    const minReach = Math.abs(L1 - L2) + 0.015;
    const d = clamp(toTarget.length(), minReach, maxReach);
    if (toTarget.lengthSq() < 1e-8) toTarget.set(0, -1, 0.2);
    const dirT = toTarget.normalize();

    const cosAlpha = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1);
    const sinAlpha = Math.sqrt(Math.max(0, 1 - cosAlpha * cosAlpha));

    const poleOrtho = _v3.copy(poleWorldDir).addScaledVector(dirT, -poleWorldDir.dot(dirT));
    if (poleOrtho.lengthSq() < 1e-6) poleOrtho.set(0, -1, 0);
    poleOrtho.normalize();

    const pElbowTarget = _v4
      .copy(pShoulder)
      .addScaledVector(dirT, L1 * cosAlpha)
      .addScaledVector(poleOrtho, L1 * sinAlpha);

    const dirSE_desired = _v5.copy(pElbowTarget).sub(pShoulder).normalize();
    const dirEH_desired = _v3.copy(targetWorldPos).sub(pElbowTarget).normalize();

    const parentWorldQuatS = upper.parent.getWorldQuaternion(_q1);
    const restWorldQuatS = _q2.copy(parentWorldQuatS).multiply(restUpper.quaternion);
    const dirSE_restWorld = arm.rest.upperLocalDir.clone().applyQuaternion(restWorldQuatS).normalize();

    const deltaS = _q3.setFromUnitVectors(dirSE_restWorld, dirSE_desired);
    const targetWorldQuatS = deltaS.multiply(restWorldQuatS);
    const targetLocalQuatS = parentWorldQuatS.clone().invert().multiply(targetWorldQuatS);

    upper.quaternion.copy(restUpper.quaternion).slerp(targetLocalQuatS, blend);
    upper.updateMatrixWorld(true);

    const restFore = restPoses.get(fore);
    if (restFore && arm.rest.forearmLocalDir) {
      const parentWorldQuatE = fore.parent.getWorldQuaternion(_q1);
      const restWorldQuatE = _q2.copy(parentWorldQuatE).multiply(restFore.quaternion);
      const dirEH_restWorld = arm.rest.forearmLocalDir.clone().applyQuaternion(restWorldQuatE).normalize();

      const deltaE = _q3.setFromUnitVectors(dirEH_restWorld, dirEH_desired);
      const targetWorldQuatE = deltaE.multiply(restWorldQuatE);
      const targetLocalQuatE = parentWorldQuatE.clone().invert().multiply(targetWorldQuatE);

      fore.quaternion.copy(restFore.quaternion).slerp(targetLocalQuatE, blend);
      fore.updateMatrixWorld(true);
    }
  } else {
    const dirDesired = _v2.copy(targetWorldPos).sub(pShoulder).normalize();
    const parentWorldQuatS = upper.parent.getWorldQuaternion(_q1);
    const restWorldQuatS = _q2.copy(parentWorldQuatS).multiply(restUpper.quaternion);
    const dirSE_restWorld = (arm.rest.upperLocalDir || new THREE.Vector3(0, -1, 0)).clone().applyQuaternion(restWorldQuatS).normalize();
    const deltaS = _q3.setFromUnitVectors(dirSE_restWorld, dirDesired);
    const targetLocalQuatS = parentWorldQuatS.clone().invert().multiply(deltaS.multiply(restWorldQuatS));
    upper.quaternion.copy(restUpper.quaternion).slerp(targetLocalQuatS, blend);
    upper.updateMatrixWorld(true);
  }

  if (hand && arm.fingers.length) {
    const curlAngle = fingerCurl * 0.92 * blend * (arm.side === 'left' ? 1 : -1);
    for (const finger of arm.fingers) {
      const rf = restPoses.get(finger);
      if (!rf) continue;
      _e1.set(0, 0, curlAngle);
      _q1.setFromEuler(_e1).multiply(rf.quaternion);
      finger.quaternion.copy(rf.quaternion).slerp(_q1, blend);
    }
  }
}

/**
 * Procedural Cyber-Viking Terminal Renderer & Curved Facial Geometry Shader Patch.
 */
class HolographicFaceDisplay {
  constructor(rig) {
    this.rig = rig;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 640;
    this.ctx = this.canvas.getContext('2d');

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    this.headInvMatrix = new THREE.Matrix4();
    this.uniforms = {
      uValhallaHeadInv: { value: this.headInvMatrix },
      uValhallaCodeMix: { value: 0.0 },
      uValhallaCodePulse: { value: 0.0 },
      uValhallaSurpriseMix: { value: 0.0 },
      uValhallaTime: { value: 0.0 },
      uValhallaCodeTex: { value: this.texture },
      uValhallaFaceCenter: { value: rig.faceBounds.center.clone() },
      uValhallaFaceHalfSize: { value: rig.faceBounds.halfSize.clone() },
      uValhallaUseFullMesh: { value: rig.useFullFaceMesh ? 1.0 : 0.0 },
    };

    this.patchedMaterials = [];
    this.patchFaceMaterials();

    this._codeScripts = [
      { prefix: '$ ', text: 'valhalla --neural-sync --core=gungnir', color: 'orange' },
      { prefix: '0x7F9A ', text: 'ALLOC_MATRIX [4096x256] OK', color: 'cyan' },
      { prefix: 'fn ', text: 'decodeRunes(stream: &[u8]) -> Matrix {', color: 'orange' },
      { prefix: '  let ', text: 'hash = 0xAE49_F10C ^ ODIN_KEY;', color: 'amber' },
      { prefix: '  if ', text: 'sync > 0.994 { emitPulse(0xFF6B00); }', color: 'orange' },
      { prefix: '>> ', text: 'SYS_BUS: 0x00C4  0x8E3B  0xFA12  0x19D0', color: 'cyan' },
      { prefix: 'exec ', text: 'bifrost_route --encrypt AES-GCM', color: 'orange' },
      { prefix: '0x4B21 ', text: 'NEURAL_WEIGHTS: CONVERGED [99.98%]', color: 'cyan' },
      { prefix: 'const ', text: 'visor = gl.shaderPatch(HEAD_SPACE);', color: 'amber' },
      { prefix: '  return ', text: 'Status::READY_FOR_COMBAT;', color: 'orange' },
      { prefix: '} ', text: '// RUNE_CHECKSUM: 0x9C72A1FF', color: 'dim' },
      { prefix: '$ ', text: 'ping -c 1 asgard.core // 0.34ms', color: 'cyan' },
    ];

    this.lines = [];
    this.cursorLineIdx = 0;
    this.charProgress = 0;
    this.scrollOffset = 0;
    this.renderAccum = 0;
    this.resetTerminal();
  }

  patchFaceMaterials() {
    const cloned = new Map();
    for (const mesh of this.rig.faceMeshes) {
      if (!mesh.material) continue;
      const srcMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const nextMats = srcMats.map((srcMat) => {
        if (cloned.has(srcMat)) return cloned.get(srcMat);
        const mat = srcMat.clone();
        cloned.set(srcMat, mat);

        if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
          mat.customProgramCacheKey = () => `valhalla-face-display-v1-${mat.type}`;
          mat.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, this.uniforms);

            shader.vertexShader = shader.vertexShader
              .replace(
                '#include <common>',
                `#include <common>
                uniform mat4 uValhallaHeadInv;
                varying vec3 vValhallaHeadPos;
                varying vec3 vValhallaHeadNormal;`
              )
              .replace(
                '#include <project_vertex>',
                `#include <project_vertex>
                {
                  vec4 vhlWorldPos = modelMatrix * vec4( transformed, 1.0 );
                  vValhallaHeadPos = ( uValhallaHeadInv * vhlWorldPos ).xyz;
                  vec3 vhlWorldNorm = normalize( mat3( modelMatrix ) * objectNormal );
                  vValhallaHeadNormal = normalize( mat3( uValhallaHeadInv ) * vhlWorldNorm );
                }`
              );

            shader.fragmentShader = shader.fragmentShader
              .replace(
                '#include <common>',
                `#include <common>
                uniform float uValhallaCodeMix;
                uniform float uValhallaCodePulse;
                uniform float uValhallaSurpriseMix;
                uniform float uValhallaTime;
                uniform sampler2D uValhallaCodeTex;
                uniform vec3 uValhallaFaceCenter;
                uniform vec3 uValhallaFaceHalfSize;
                uniform float uValhallaUseFullMesh;
                varying vec3 vValhallaHeadPos;
                varying vec3 vValhallaHeadNormal;

                float valhallaComputeFaceMask(out vec2 faceUV, out float rimFactor) {
                  vec3 safeHalf = max(uValhallaFaceHalfSize, vec3(0.001));
                  vec3 rel = (vValhallaHeadPos - uValhallaFaceCenter) / safeHalf;
                  faceUV = clamp(rel.xy * 0.5 + 0.5, 0.0, 1.0);
                  rimFactor = 0.0;
                  if (uValhallaCodeMix <= 0.001 && uValhallaSurpriseMix <= 0.001) return 0.0;

                  vec3 n = normalize(vValhallaHeadNormal);
                  float frontFacing = smoothstep(0.10, 0.48, n.z);

                  float shapeMask = 1.0;
                  if (uValhallaUseFullMesh < 0.5) {
                    float ovalDist = length(vec2(rel.x * 1.06, (rel.y - 0.04) * 1.02));
                    float oval = 1.0 - smoothstep(0.72, 0.96, ovalDist);
                    float zCut = smoothstep(-0.22, 0.18, rel.z);
                    shapeMask = oval * zCut;
                    rimFactor = smoothstep(0.68, 0.85, ovalDist) * (1.0 - smoothstep(0.85, 0.97, ovalDist)) * zCut;
                  } else {
                    float edgeDist = max(abs(rel.x), abs(rel.y));
                    rimFactor = smoothstep(0.80, 0.98, edgeDist);
                    shapeMask = smoothstep(-0.45, 0.05, rel.z);
                  }

                  return clamp(shapeMask * frontFacing, 0.0, 1.0);
                }`
              )
              .replace(
                '#include <color_fragment>',
                `#include <color_fragment>
                vec2 vhlFaceUV = vec2(0.0);
                float vhlRim = 0.0;
                float vhlFaceMask = valhallaComputeFaceMask(vhlFaceUV, vhlRim);
                float vhlScreenMix = smoothstep(0.0, 0.55, uValhallaCodeMix) * vhlFaceMask;
                if (vhlScreenMix > 0.001) {
                  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.008, 0.010, 0.014), vhlScreenMix);
                }`
              )
              .replace(
                '#include <roughnessmap_fragment>',
                `#include <roughnessmap_fragment>
                if (vhlScreenMix > 0.001) {
                  roughnessFactor = mix(roughnessFactor, 0.065, vhlScreenMix);
                }`
              )
              .replace(
                '#include <metalnessmap_fragment>',
                `#include <metalnessmap_fragment>
                if (vhlScreenMix > 0.001) {
                  metalnessFactor = mix(metalnessFactor, 0.28, vhlScreenMix);
                }`
              )
              .replace(
                '#include <emissivemap_fragment>',
                `#include <emissivemap_fragment>
                if (vhlScreenMix > 0.001) {
                  float vhlCodeVis = smoothstep(0.22, 0.92, uValhallaCodeMix) * vhlFaceMask;
                  vec4 codeSample = texture2D(uValhallaCodeTex, vhlFaceUV);
                  float scanline = 0.90 + 0.10 * sin(vhlFaceUV.y * 190.0 - uValhallaTime * 8.0);
                  float sweepY = fract(uValhallaTime * 0.42);
                  float scanBar = exp(-abs(vhlFaceUV.y - sweepY) * 26.0) * 0.42;
                  vec3 orange = vec3(1.0, 0.44, 0.07);
                  vec3 cyan = vec3(0.22, 0.92, 1.0);
                  vec3 scanGlow = mix(orange, cyan, 0.28) * scanBar;
                  vec3 edgeGlow = mix(orange, cyan, 0.32) * vhlRim * (0.24 + 0.38 * uValhallaCodePulse);
                  vec3 digitalEmissive = (codeSample.rgb * (1.28 + 0.55 * uValhallaCodePulse) * scanline + scanGlow + edgeGlow) * vhlCodeVis;
                  totalEmissiveRadiance = mix(totalEmissiveRadiance, vec3(0.0), vhlScreenMix * 0.95) + digitalEmissive;
                }
                if (uValhallaSurpriseMix > 0.001 && vhlFaceMask > 0.001) {
                  float eyeBand = exp(-pow((vhlFaceUV.y - 0.56) * 8.5, 2.0));
                  float eyePair = exp(-pow((abs(vhlFaceUV.x - 0.5) - 0.18) * 11.0, 2.0));
                  totalEmissiveRadiance += vec3(0.35, 0.95, 1.0) * eyeBand * eyePair * uValhallaSurpriseMix * 0.35 * vhlFaceMask;
                }`
              );
          };
          mat.needsUpdate = true;
          this.patchedMaterials.push(mat);
        }
        return mat;
      });
      mesh.material = Array.isArray(mesh.material) ? nextMats : nextMats[0];
    }
  }

  resetTerminal() {
    this.lines = [];
    for (let i = 0; i < 8; i++) {
      this.lines.push({ ...this._codeScripts[i % this._codeScripts.length], typed: 999, flash: 0 });
    }
    this.cursorLineIdx = this._codeScripts.length % this._codeScripts.length;
    this.lines.push({ ...this._codeScripts[this.cursorLineIdx], typed: 0, flash: 0 });
    this.charProgress = 0;
    this.renderAccum = 1;
  }

  update(dt, time, codeMix, pulse, surpriseMix = 0) {
    const headRef = this.rig.head || this.rig.model;
    headRef.updateMatrixWorld(true);
    this.headInvMatrix.copy(headRef.matrixWorld).invert();

    this.uniforms.uValhallaCodeMix.value = codeMix;
    this.uniforms.uValhallaCodePulse.value = pulse;
    this.uniforms.uValhallaSurpriseMix.value = surpriseMix;
    this.uniforms.uValhallaTime.value = time;

    if (codeMix <= 0.01) return;

    this.renderAccum += dt;
    if (this.renderAccum < 1 / 26) return;
    const stepDt = this.renderAccum;
    this.renderAccum = 0;

    const active = this.lines[this.lines.length - 1];
    const fullLen = active.prefix.length + active.text.length;
    this.charProgress += stepDt * 34;
    active.typed = Math.floor(this.charProgress);

    for (const l of this.lines) {
      if (l.flash > 0) l.flash = Math.max(0, l.flash - stepDt * 2.8);
    }

    if (active.typed >= fullLen + 6) {
      active.typed = fullLen;
      active.flash = 1.0;
      this.cursorLineIdx = (this.cursorLineIdx + 1) % this._codeScripts.length;
      this.lines.push({ ...this._codeScripts[this.cursorLineIdx], typed: 0, flash: 0 });
      if (this.lines.length > 17) this.lines.shift();
      this.charProgress = 0;
    }

    this.drawTerminalCanvas(time, pulse);
    this.texture.needsUpdate = true;
  }

  drawTerminalCanvas(time, pulse) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = '#020305';
    ctx.fillRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(w * 0.5, h * 0.48, 12, w * 0.5, h * 0.5, w * 0.65);
    grad.addColorStop(0, `rgba(255, 110, 20, ${0.11 + pulse * 0.12})`);
    grad.addColorStop(0.55, `rgba(38, 215, 255, ${0.04 + pulse * 0.05})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 130, 45, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 32; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 32; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.font = 'bold 14px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = '#ff8a2b';
    ctx.fillText('VALHALLA // NEURAL_EXEC', 34, 48);
    ctx.fillStyle = '#48e8ff';
    const hexClock = Math.floor(time * 256).toString(16).toUpperCase().padStart(4, '0');
    ctx.fillText(`0x${hexClock}`, w - 102, 48);

    ctx.fillStyle = 'rgba(255, 128, 32, 0.38)';
    ctx.fillRect(34, 58, w - 68, 1.5);

    const startY = 92;
    const lineH = 29;
    ctx.font = '600 15.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

    this.lines.forEach((line, idx) => {
      const y = startY + idx * lineH;
      if (y > h - 48) return;

      if (line.flash > 0.02) {
        ctx.fillStyle = `rgba(255, 122, 24, ${line.flash * 0.22})`;
        ctx.fillRect(28, y - 18, w - 56, 24);
      }

      const full = line.prefix + line.text;
      const visibleCount = Math.min(full.length, line.typed);
      const visiblePrefix = line.prefix.slice(0, Math.min(line.prefix.length, visibleCount));
      const visibleBody = line.text.slice(0, Math.max(0, visibleCount - line.prefix.length));

      ctx.shadowBlur = 8;
      ctx.shadowColor = line.color === 'cyan' ? 'rgba(60, 232, 255, 0.7)' : 'rgba(255, 118, 22, 0.75)';

      ctx.fillStyle = line.color === 'cyan' ? '#4deaff' : '#ff6b1a';
      ctx.fillText(visiblePrefix, 34, y);

      const prefixW = ctx.measureText(visiblePrefix).width;
      ctx.fillStyle =
        line.color === 'cyan'
          ? '#8bf3ff'
          : line.color === 'amber'
          ? '#ffbe6b'
          : line.color === 'dim'
          ? '#a9744d'
          : '#ff9638';
      ctx.fillText(visibleBody, 34 + prefixW, y);

      if (idx === this.lines.length - 1 && Math.floor(time * 7) % 2 === 0) {
        const totalW = prefixW + ctx.measureText(visibleBody).width;
        ctx.fillStyle = '#ff7b1c';
        ctx.fillRect(38 + totalW, y - 14, 9, 17);
      }
      ctx.shadowBlur = 0;
    });

    ctx.fillStyle = 'rgba(72, 232, 255, 0.65)';
    ctx.font = '12px ui-monospace, Menlo, monospace';
    const bars = Array.from({ length: 14 }, (_, i) => {
      const val = Math.floor((0.5 + 0.5 * Math.sin(time * 5.2 + i * 0.7)) * 255)
        .toString(16)
        .toUpperCase()
        .padStart(2, '0');
      return val;
    }).join(' ');
    ctx.fillText(bars, 34, h - 24);
  }

  dispose() {
    this.texture.dispose();
    this.patchedMaterials.forEach((m) => m.dispose());
    this.patchedMaterials.length = 0;
  }
}

/* ============================================================================
 * Built-in Cinematic Animations
 * ========================================================================== */

function createSpearSpinAnimation() {
  return {
    id: 'spearSpin',
    label: 'One-Handed Spear Spin & Transfer',
    duration: 6.5,
    canPlay(rig) {
      return rig.capabilities.hasSpear;
    },
    createState(rig) {
      const spear = rig.spear;
      const startSide = spear.restSide || 'right';
      const otherSide = startSide === 'right' ? 'left' : 'right';
      const bodyMaxZ = rig.bodyModelBox.max.z;
      const bodySize = rig.bodyModelBox.getSize(new THREE.Vector3());
      const clearanceZ = bodyMaxZ + Math.max(0.18, bodySize.z * 0.28);
      const centerY = rig.bodyModelBox.min.y + bodySize.y * 0.56;
      const handSpanX = Math.max(0.24, bodySize.x * 0.30);

      rig.model.updateMatrixWorld(true);
      const restGripWorld = spear.localGripCenter.clone().applyMatrix4(spear.node.matrixWorld);
      const restGripModel = rig.model.worldToLocal(restGripWorld.clone());
      const restSpearWorldQuat = spear.node.getWorldQuaternion(new THREE.Quaternion());
      const modelWorldQuatInv = rig.model.getWorldQuaternion(new THREE.Quaternion()).invert();
      const restSpearModelQuat = modelWorldQuatInv.multiply(restSpearWorldQuat);

      const qShaftToY = new THREE.Quaternion().setFromUnitVectors(spear.localShaftAxis, new THREE.Vector3(0, 1, 0));
      const restPivotQuat = restSpearModelQuat.clone().multiply(qShaftToY.clone().invert());

      const pivot = new THREE.Group();
      pivot.name = '__ValhallaSpearAnimPivot';

      return {
        startSide,
        otherSide,
        clearanceZ,
        centerY,
        handSpanX,
        restGripModel,
        restPivotQuat,
        pivot,
        attached: false,
        spinAngle: 0,
      };
    },
    onEnter(rig, state) {
      const sp = rig.spear;
      rig.model.updateMatrixWorld(true);
      rig.model.add(state.pivot);
      state.pivot.position.copy(state.restGripModel);
      state.pivot.quaternion.copy(state.restPivotQuat);
      state.pivot.updateMatrixWorld(true);

      if (!sp.isBone) {
        state.pivot.attach(sp.node);
        state.attached = true;
      }
    },
    update(rig, state, t, dt, blend) {
      const sp = rig.spear;
      const domSign = state.startSide === 'right' ? -1 : 1;
      const oppSign = -domSign;

      let omega = 0;
      if (t < 0.75) {
        omega = 18.5 * easeInOutCubic(t / 0.75);
      } else if (t < 4.70) {
        omega = 18.5 + Math.sin(t * 2.5) * 1.1;
      } else if (t < 5.65) {
        const brake = 1 - easeInOutCubic((t - 4.70) / 0.95);
        omega = 18.5 * brake;
      }
      state.spinAngle += omega * dt;

      let effectiveSpin = state.spinAngle;
      if (t >= 4.70) {
        const catchU = smoothstep(4.70, 5.65, t);
        const nearest2Pi = Math.round(state.spinAngle / (Math.PI * 2)) * (Math.PI * 2);
        effectiveSpin = THREE.MathUtils.lerp(state.spinAngle, nearest2Pi, catchU);
      }

      let handAlpha = 0;
      let tossArc = 0;
      if (t >= 2.25 && t < 3.15) {
        handAlpha = easeInOutCubic((t - 2.25) / 0.90);
        tossArc = Math.sin(Math.PI * handAlpha);
      } else if (t >= 3.15 && t < 5.45) {
        handAlpha = 1;
      } else if (t >= 5.45) {
        const returnU = easeInOutCubic((t - 5.45) / 0.95);
        handAlpha = 1 - returnU;
        tossArc = Math.sin(Math.PI * returnU) * 0.45;
      }

      const domPos = _v1.set(domSign * state.handSpanX, state.centerY + 0.04, state.clearanceZ);
      const oppPos = _v2.set(oppSign * state.handSpanX, state.centerY + 0.06, state.clearanceZ + 0.02);
      const activeGripModel = _v3.lerpVectors(domPos, oppPos, handAlpha);
      activeGripModel.y += tossArc * 0.09;
      activeGripModel.z += tossArc * 0.07;

      const spinActiveWeight = smoothstep(0.55, 0.95, t) * (1 - smoothstep(4.65, 5.45, t)) * (1 - tossArc * 0.85);
      activeGripModel.x += Math.cos(effectiveSpin) * 0.024 * spinActiveWeight;
      activeGripModel.y += Math.sin(effectiveSpin) * 0.024 * spinActiveWeight;

      const stageBlend = smoothstep(0.0, 0.70, t) * (1 - smoothstep(5.65, 6.45, t));
      state.pivot.position.lerpVectors(state.restGripModel, activeGripModel, stageBlend * blend);

      const spinTiltQuat = _q1.setFromEuler(_e1.set(0.18 * stageBlend, domSign * 0.10 * (1 - handAlpha * 2) * stageBlend, 0));
      const spinRollQuat = _q2.setFromAxisAngle(_v4.set(0, 0, domSign), effectiveSpin);
      const animPivotQuat = state.restPivotQuat.clone().multiply(spinTiltQuat).multiply(spinRollQuat);
      state.pivot.quaternion.copy(state.restPivotQuat).slerp(animPivotQuat, blend);
      state.pivot.updateMatrixWorld(true);

      if (sp.isBone) {
        sp.node.parent.updateMatrixWorld(true);
        const parentInv = _m1.copy(sp.node.parent.matrixWorld).invert();
        const desiredWorldPos = state.pivot.getWorldPosition(_v4);
        const offsetWorld = sp.localGripCenter.clone().applyQuaternion(state.pivot.getWorldQuaternion(_q3));
        desiredWorldPos.sub(offsetWorld);
        sp.node.position.copy(desiredWorldPos.applyMatrix4(parentInv));
        const parentQuatInv = sp.node.parent.getWorldQuaternion(_q4).invert();
        sp.node.quaternion.copy(parentQuatInv.multiply(state.pivot.getWorldQuaternion(_q3)));
      }

      const torsoTwist = (domSign * 0.16 * (1 - handAlpha * 2)) * stageBlend;
      const torsoLean = -0.06 * stageBlend;
      if (rig.torso) {
        const rt = rig.restPoses.get(rig.torso);
        if (rt) {
          _q1.setFromEuler(_e1.set(torsoLean, torsoTwist, 0)).multiply(rt.quaternion);
          rig.torso.quaternion.copy(rt.quaternion).slerp(_q1, blend);
        }
      }
      if (rig.head) {
        const rh = rig.restPoses.get(rig.head);
        if (rh) {
          const lookYaw = domSign * 0.24 * (1 - handAlpha * 2) * stageBlend;
          const lookPitch = 0.08 * stageBlend;
          _q1.setFromEuler(_e1.set(lookPitch, lookYaw, 0)).multiply(rh.quaternion);
          rig.head.quaternion.slerp(_q1, blend);
        }
      }

      const domArm = state.startSide === 'right' ? rig.rightArm : rig.leftArm;
      const oppArm = state.startSide === 'right' ? rig.leftArm : rig.rightArm;

      const gripWorld = state.pivot.getWorldPosition(new THREE.Vector3());
      const domReadyWorld = rig.model.localToWorld(domPos.clone());
      const oppReadyWorld = rig.model.localToWorld(oppPos.clone());

      const domHold = 1 - smoothstep(0.18, 0.58, handAlpha);
      const domReturn = smoothstep(5.30, 6.25, t);
      const domWeight = clamp(stageBlend * Math.max(domHold, domReturn), 0, 1) * blend;
      const domTarget = domReadyWorld.clone().lerp(gripWorld, domHold);
      const domCurl = domHold > 0.3 ? 0.85 : 0.12;

      const oppCatch = smoothstep(0.28, 0.88, handAlpha) * (1 - smoothstep(5.35, 6.10, t));
      const oppGuardWeight = stageBlend * blend;
      const oppTarget = oppReadyWorld.clone().lerp(gripWorld, oppCatch);
      const oppCurl = oppCatch > 0.5 ? 0.85 : 0.25;

      if (domArm?.upperArm) {
        solveArmIK(domArm, domTarget, new THREE.Vector3(domSign * 0.55, -0.7, -0.45), rig.restPoses, domWeight, domCurl);
      }
      if (oppArm?.upperArm) {
        solveArmIK(oppArm, oppTarget, new THREE.Vector3(oppSign * 0.55, -0.7, -0.45), rig.restPoses, oppGuardWeight * Math.max(0.45, oppCatch), oppCurl);
      }
    },
    onExit(rig, state) {
      const sp = rig.spear;
      if (state.attached && sp && !sp.isBone) {
        sp.restParent.attach(sp.node);
        sp.node.position.copy(sp.restPosition);
        sp.node.quaternion.copy(sp.restQuaternion);
        sp.node.scale.copy(sp.restScale);
      } else if (sp?.isBone) {
        sp.node.position.copy(sp.restPosition);
        sp.node.quaternion.copy(sp.restQuaternion);
        sp.node.scale.copy(sp.restScale);
      }
      state.pivot.removeFromParent();
    },
  };
}

function createSurprisedReactionAnimation() {
  return {
    id: 'surprisedReaction',
    label: 'Surprised / Amazed Reaction',
    duration: 4.4,
    canPlay() {
      return true;
    },
    createState(rig) {
      const spearSide = rig.spear?.restSide || 'right';
      const freeSide = spearSide === 'right' ? 'left' : 'right';
      const freeArm = freeSide === 'left' ? rig.leftArm : rig.rightArm;
      const sideSign = freeSide === 'left' ? 1 : -1;

      rig.model.updateMatrixWorld(true);
      let beardTargetModel = new THREE.Vector3(sideSign * 0.08, 0.22, 0.28);
      if (rig.beard) {
        const bBox = measureObjectBoxInSpace(rig.beard, rig.model);
        if (bBox) {
          const ctr = bBox.getCenter(new THREE.Vector3());
          const sz = bBox.getSize(new THREE.Vector3());
          beardTargetModel.set(ctr.x + sideSign * sz.x * 0.20, ctr.y + sz.y * 0.05, bBox.max.z + 0.038);
        }
      } else if (rig.head) {
        const hBox = measureObjectBoxInSpace(rig.head, rig.model);
        if (hBox) {
          const ctr = hBox.getCenter(new THREE.Vector3());
          const sz = hBox.getSize(new THREE.Vector3());
          beardTargetModel.set(ctr.x + sideSign * sz.x * 0.12, hBox.min.y + sz.y * 0.22, hBox.max.z + 0.035);
        }
      }

      return { freeArm, sideSign, beardTargetModel };
    },
    update(rig, state, t, dt, blend, context) {
      const shockSnap = easeOutBack(clamp(t / 0.44, 0, 1), 1.25) * (1 - easeInOutCubic(clamp((t - 3.05) / 1.15, 0, 1)));
      const handReach = easeInOutCubic(clamp((t - 0.18) / 0.72, 0, 1)) * (1 - easeInOutCubic(clamp((t - 2.95) / 0.90, 0, 1)));
      const strokeActive = smoothstep(0.85, 1.20, t) * (1 - smoothstep(2.70, 3.05, t));
      const strokeWave = Math.sin(t * 5.4) * strokeActive;

      if (rig.head) {
        const rh = rig.restPoses.get(rig.head);
        if (rh) {
          const pitch = (-0.15 + strokeWave * 0.025) * shockSnap;
          const yaw = (state.sideSign * -0.18 + Math.sin(t * 2.1) * 0.03) * shockSnap;
          const roll = state.sideSign * 0.10 * shockSnap;
          _q1.setFromEuler(_e1.set(pitch, yaw, roll)).multiply(rh.quaternion);
          rig.head.quaternion.slerp(_q1, blend);
        }
      }

      if (rig.torso) {
        const rt = rig.restPoses.get(rig.torso);
        if (rt) {
          _q1.setFromEuler(_e1.set(-0.08 * shockSnap, state.sideSign * -0.07 * shockSnap, 0)).multiply(rt.quaternion);
          rig.torso.quaternion.copy(rt.quaternion).slerp(_q1, blend);
        }
      } else if (context.modelGroup) {
        context.modelGroup.rotation.x = -0.06 * shockSnap * blend;
      }

      const exprLevel = shockSnap * blend;
      for (const m of rig.morphBindings.eyeWide) m.mesh.morphTargetInfluences[m.index] = 0.95 * exprLevel;
      for (const m of rig.morphBindings.browUp) m.mesh.morphTargetInfluences[m.index] = 0.92 * exprLevel;
      for (const m of rig.morphBindings.surprise) m.mesh.morphTargetInfluences[m.index] = 0.88 * exprLevel;

      for (const eye of rig.eyes) {
        const re = rig.restPoses.get(eye);
        if (!re) continue;
        eye.scale.set(
          re.scale.x * (1 + 0.18 * exprLevel),
          re.scale.y * (1 + 0.44 * exprLevel),
          re.scale.z * (1 + 0.14 * exprLevel)
        );
      }
      for (const em of rig.eyeMaterials) {
        em.material.emissiveIntensity = em.emissiveIntensity * (1 + 0.55 * exprLevel);
      }

      for (const brow of rig.brows) {
        const rb = rig.restPoses.get(brow);
        if (!rb) continue;
        brow.position.y = rb.position.y + 0.022 * exprLevel;
        _q1.setFromEuler(_e1.set(0, 0, 0.12 * exprLevel)).multiply(rb.quaternion);
        brow.quaternion.copy(rb.quaternion).slerp(_q1, blend);
      }

      if (rig.beard) {
        const rbd = rig.restPoses.get(rig.beard);
        if (rbd) {
          _q1.setFromEuler(_e1.set(0.02 * strokeWave, 0.04 * strokeWave, 0)).multiply(rbd.quaternion);
          rig.beard.quaternion.copy(rbd.quaternion).slerp(_q1, blend);
        }
      }

      if (!rig.capabilities.hasMorphs && !rig.capabilities.hasEyesOrBrows && context.faceDisplay) {
        context.faceDisplay.uniforms.uValhallaSurpriseMix.value = exprLevel;
      }

      if (state.freeArm?.upperArm) {
        const targetModel = state.beardTargetModel.clone();
        targetModel.y += strokeWave * 0.018;
        targetModel.x += strokeWave * state.sideSign * 0.008;
        const targetWorld = rig.model.localToWorld(targetModel);
        solveArmIK(
          state.freeArm,
          targetWorld,
          new THREE.Vector3(state.sideSign * 0.52, -0.65, -0.55),
          rig.restPoses,
          handReach * blend,
          0.55 + 0.22 * strokeWave
        );
      }
    },
    onExit(rig, state, context) {
      if (context.modelGroup) context.modelGroup.rotation.x = 0;
      if (context.faceDisplay) context.faceDisplay.uniforms.uValhallaSurpriseMix.value = 0;
    },
  };
}

function createCodingModeAnimation() {
  return {
    id: 'codingMode',
    label: 'Holographic Coding / Hacker Mode',
    duration: 6.8,
    canPlay(rig) {
      return rig.capabilities.hasFaceDisplay;
    },
    createState() {
      return {
        time: 0,
        lastPulseTrigger: 0,
      };
    },
    onEnter(rig, state, context) {
      context.faceDisplay?.resetTerminal();
    },
    update(rig, state, t, dt, blend, context) {
      state.time += dt;

      const enterU = smoothstep(0.05, 0.90, t);
      const exitU = 1 - smoothstep(5.70, 6.55, t);
      const codeMix = clamp(enterU * exitU * blend, 0, 1);

      const pulsePhase = (t * 0.85) % 1;
      const pulse = Math.exp(-Math.pow((pulsePhase - 0.15) * 7.5, 2)) * 0.85 + Math.sin(t * 9.0) * 0.08 + 0.12;

      if (rig.head) {
        const rh = rig.restPoses.get(rig.head);
        if (rh) {
          const focusNod = (0.065 + Math.sin(t * 1.4) * 0.015) * codeMix;
          const microScan = Math.sin(t * 2.3) * 0.025 * codeMix;
          _q1.setFromEuler(_e1.set(focusNod, microScan, 0)).multiply(rh.quaternion);
          rig.head.quaternion.slerp(_q1, blend);
        }
      }

      const eyeFade = 1 - smoothstep(0.05, 0.45, codeMix);
      for (const em of rig.eyeMaterials) {
        em.material.emissiveIntensity = em.emissiveIntensity * eyeFade;
        em.material.transparent = true;
        em.material.opacity = THREE.MathUtils.lerp(0.04, em.opacity, eyeFade);
      }

      context.faceDisplay?.update(dt, state.time, codeMix, pulse, 0);
    },
    onExit(rig, state, context) {
      context.faceDisplay?.update(0, 0, 0, 0, 0);
      for (const em of rig.eyeMaterials) {
        em.material.emissiveIntensity = em.emissiveIntensity;
        em.material.opacity = em.opacity;
        em.material.transparent = em.transparent;
      }
    },
  };
}

/* ============================================================================
 * Priority-Aware Random Animation Controller
 * ========================================================================== */

export class ValhallaAnimationController {
  constructor(options = {}) {
    this.options = {
      minIntervalMs: 30000,
      maxIntervalMs: 90000,
      isSoftwareGl: Boolean(options.isSoftwareGl),
      enableAutoRandom: options.enableAutoRandom !== false,
      ...options,
    };

    this.rig = null;
    this.faceDisplay = null;
    this.modelGroup = null;
    this.requestRender = null;

    this.animations = new Map();
    this.registerAnimation(createSpearSpinAnimation());
    this.registerAnimation(createSurprisedReactionAnimation());
    this.registerAnimation(createCodingModeAnimation());

    this.state = 'IDLE';
    this.activeAnim = null;
    this.activeAnimState = null;
    this.elapsed = 0;
    this.blendWeight = 0;
    this.interruptFade = 0.35;
    this.interruptProgress = 0;
    this.lastAnimationId = null;

    this.priorityFlags = {
      thinking: false,
      chatOpen: false,
      modalOpen: false,
      orbiting: false,
      hidden: typeof document !== 'undefined' && document.visibilityState === 'hidden',
    };

    this.nextTriggerMs = this._rollNextDelay();
    this._onVisibilityChange = () => {
      this.setPriorityState('hidden', document.visibilityState === 'hidden');
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this._onVisibilityChange);
    }
  }

  registerAnimation(animDef) {
    if (!animDef?.id) throw new Error('Animation definition requires a unique id.');
    this.animations.set(animDef.id, animDef);
    return this;
  }

  init(model, gltf, context = {}) {
    this.modelGroup = context.modelGroup || null;
    this.requestRender = context.requestRender || null;
    this.rig = inspectValhallaRig(model, gltf, {
      headGroup: context.headGroup,
      neckGroup: context.neckGroup,
    });
    this.faceDisplay = new HolographicFaceDisplay(this.rig);
  }

  _rollNextDelay() {
    const { minIntervalMs, maxIntervalMs } = this.options;
    return minIntervalMs + Math.random() * Math.max(0, maxIntervalMs - minIntervalMs);
  }

  setPriorityState(flag, value) {
    const prev = this.priorityFlags[flag];
    this.priorityFlags[flag] = Boolean(value);

    const highPriorityActive = this.priorityFlags.thinking || this.priorityFlags.chatOpen || this.priorityFlags.modalOpen;
    if (highPriorityActive && !prev) {
      if (this.state === 'PERFORMING') {
        this.interrupt(0.32);
      }
      this.nextTriggerMs = this._rollNextDelay();
    }
  }

  isSchedulingBlocked() {
    return (
      !this.options.enableAutoRandom ||
      this.priorityFlags.thinking ||
      this.priorityFlags.chatOpen ||
      this.priorityFlags.modalOpen ||
      this.priorityFlags.orbiting ||
      this.priorityFlags.hidden
    );
  }

  isPerforming() {
    return this.state !== 'IDLE';
  }

  isControllingRoot() {
    return this.state !== 'IDLE' && !this.rig?.torso;
  }

  needsContinuousRender() {
    return this.state !== 'IDLE';
  }

  getHeadTrackingWeight() {
    return clamp(1 - this.blendWeight, 0, 1);
  }

  play(id, { force = false } = {}) {
    if (!this.rig) return false;
    const anim = this.animations.get(id);
    if (!anim || !anim.canPlay(this.rig)) return false;
    if (this.state !== 'IDLE' && !force) return false;
    if (this.state !== 'IDLE' && force) this.stopImmediate();

    this.activeAnim = anim;
    this.activeAnimState = anim.createState ? anim.createState(this.rig) : {};
    this.elapsed = 0;
    this.blendWeight = 0;
    this.state = 'PERFORMING';
    this.lastAnimationId = anim.id;

    anim.onEnter?.(this.rig, this.activeAnimState, {
      faceDisplay: this.faceDisplay,
      modelGroup: this.modelGroup,
    });

    if (this.options.isSoftwareGl && this.requestRender) this.requestRender();
    return true;
  }

  playRandom() {
    if (!this.rig || this.state !== 'IDLE') return false;
    const eligible = [...this.animations.values()].filter((a) => a.canPlay(this.rig));
    if (!eligible.length) return false;

    const pool = eligible.length > 1 ? eligible.filter((a) => a.id !== this.lastAnimationId) : eligible;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    return this.play(picked.id);
  }

  interrupt(fadeDurationSec = 0.35) {
    if (this.state !== 'PERFORMING') return;
    this.state = 'BLENDING_OUT';
    this.interruptFade = Math.max(0.12, fadeDurationSec);
    this.interruptProgress = 0;
  }

  stopImmediate() {
    if (this.activeAnim) {
      this.activeAnim.onExit?.(this.rig, this.activeAnimState, {
        faceDisplay: this.faceDisplay,
        modelGroup: this.modelGroup,
      });
    }
    this._restoreAllRestPoses();
    this.activeAnim = null;
    this.activeAnimState = null;
    this.blendWeight = 0;
    this.elapsed = 0;
    this.state = 'IDLE';
  }

  _restoreAllRestPoses() {
    if (!this.rig) return;
    for (const [node, rest] of this.rig.restPoses.entries()) {
      if (node !== this.rig.head && node !== this.rig.neck) {
        node.position.copy(rest.position);
        node.quaternion.copy(rest.quaternion);
        node.scale.copy(rest.scale);
      } else {
        node.scale.copy(rest.scale);
      }
    }
    for (const list of Object.values(this.rig.morphBindings)) {
      for (const m of list) m.mesh.morphTargetInfluences[m.index] = 0;
    }
    this.faceDisplay?.update(0, 0, 0, 0, 0);
  }

  update(dt) {
    if (!this.rig) return;

    if (this.state === 'IDLE') {
      if (!this.isSchedulingBlocked()) {
        this.nextTriggerMs -= dt * 1000;
        if (this.nextTriggerMs <= 0) {
          this.nextTriggerMs = this._rollNextDelay();
          this.playRandom();
        }
      }
      return;
    }

    const anim = this.activeAnim;
    const dur = anim.duration || 5.0;

    if (this.state === 'PERFORMING') {
      this.elapsed += dt;
      const enterBlend = smoothstep(0.0, 0.45, this.elapsed);
      const exitBlend = 1 - smoothstep(dur - 0.55, dur, this.elapsed);
      this.blendWeight = clamp(enterBlend * exitBlend, 0, 1);

      anim.update(this.rig, this.activeAnimState, Math.min(this.elapsed, dur), dt, this.blendWeight, {
        faceDisplay: this.faceDisplay,
        modelGroup: this.modelGroup,
      });

      if (this.elapsed >= dur) {
        this.stopImmediate();
        this.nextTriggerMs = this._rollNextDelay();
      }
    } else if (this.state === 'BLENDING_OUT') {
      this.interruptProgress += dt / this.interruptFade;
      const outFactor = 1 - easeInOutCubic(this.interruptProgress);
      this.blendWeight = clamp(outFactor, 0, 1);

      anim.update(this.rig, this.activeAnimState, this.elapsed, dt, this.blendWeight, {
        faceDisplay: this.faceDisplay,
        modelGroup: this.modelGroup,
      });

      if (this.interruptProgress >= 1) {
        this.stopImmediate();
        this.nextTriggerMs = this._rollNextDelay();
      }
    }
  }

  destroy() {
    this.stopImmediate();
    this.faceDisplay?.dispose();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this._onVisibilityChange);
    }
  }
}