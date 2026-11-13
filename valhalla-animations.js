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
  legs: null,
  spear: null,
  beard: null,
  eyes: null,
  brows: null,
  faceMeshes: null,
  leftArm: { shoulder: null, upperArm: null, forearm: null, wristJoint: null, hand: null, shoulderRaven: null, fingers: null },
  rightArm: { shoulder: null, upperArm: null, forearm: null, wristJoint: null, hand: null, shoulderRaven: null, fingers: null },
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
const _q5 = new THREE.Quaternion();
const _e1 = new THREE.Euler();
const _m1 = new THREE.Matrix4();

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
 * Inspects the loaded GLB scene graph, groups, bones, morph targets, and meshes.
 */
export function inspectValhallaRig(model, gltf = null, explicitRefs = {}) {
  model.updateMatrixWorld(true);

  const allNodes = [];
  const bones = [];
  const meshes = [];
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

  // Exclude ChestArmorGroup/plate pieces so rotating torso moves the whole upper body cleanly
  const torso =
    findByOverride(RIG_OVERRIDES.torso) ||
    findBest(
      [
        /^torsogroup$/i,
        /^torso$/i,
        /upper.?chest/i,
        /spine.?0?2/i,
        /spine.?0?1/i,
        /^spine$/i,
        /upper.?body/i,
        /^bodygroup$/i,
        /^body$/i,
        /chest/i,
      ],
      (n) => n !== head && n !== neck && !/armor|plate|pauldron|shield/i.test(n.name)
    );

  const legs =
    findByOverride(RIG_OVERRIDES.legs) ||
    findBest([/^legsgroup$/i, /^legs$/i, /pelvis/i, /^hips$/i]);

  function resolveArmSide(side) {
    const ov = RIG_OVERRIDES[`${side}Arm`] || {};
    const sideRegex =
      side === 'left'
        ? /(?:^|[_\s.-]|mixamorig)(?:left|l)(?:[_\s.-]|(?=[A-Z]))|(?:\.l$|_l$)|^left/i
        : /(?:^|[_\s.-]|mixamorig)(?:right|r)(?:[_\s.-]|(?=[A-Z]))|(?:\.r$|_r$)|^right/i;

    const excludeArmor = (n) =>
      !/armor|pauldron|shield|raven|feather|collar|fur|spear|gungnir|cuff|rivet/i.test(n.name) && n !== torso;

    const shoulder =
      findByOverride(ov.shoulder) ||
      findBest([/clavicle/i, /collar.?bone/i, /shoulder(?!.*raven)/i], (n) => sideRegex.test(n.name) && excludeArmor(n));

    const upperArm =
      findByOverride(ov.upperArm) ||
      findBest(
        [
          /^(?:left|right)armgroup$/i,
          /upper.?arm(?!or)/i,
          /arm(?!or)[_\s.-]?(?:upper|top|group)/i,
          /mixamorig.*arm$/i,
          /bicep/i,
          /\barm(?!or)\b/i,
        ],
        (n) => sideRegex.test(n.name) && excludeArmor(n) && n !== shoulder
      );

    const forearm =
      findByOverride(ov.forearm) ||
      findBest(
        [/fore.?arm(?!or)/i, /lower.?arm(?!or)/i, /elbow/i],
        (n) => sideRegex.test(n.name) && excludeArmor(n) && n !== upperArm
      );

    const wristJoint =
      findByOverride(ov.wristJoint) ||
      findBest([/wrist.?joint/i], (n) => sideRegex.test(n.name));

    const hand =
      findByOverride(ov.hand) ||
      findBest(
        [/^(?:left|right)hand$/i, /hand(?!le)/i, /wrist(?!.*cuff|.*joint)/i, /palm/i],
        (n) => sideRegex.test(n.name) && excludeArmor(n) && n !== forearm && n !== wristJoint
      );

    const shoulderRaven =
      findByOverride(ov.shoulderRaven) ||
      findBest([/shoulderraven/i, /raven/i], (n) => sideRegex.test(n.name) && !/red.?eye|head|saddle|cradle/i.test(n.name));

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

      if (forearm && pE) {
        rest.upperLength = pS.distanceTo(pE);
        rest.upperLocalDir = upperArm.worldToLocal(pE.clone()).normalize();
        if (pH) {
          rest.forearmLength = pE.distanceTo(pH);
          rest.forearmLocalDir = forearm.worldToLocal(pH.clone()).normalize();
        }
      } else if (pH) {
        rest.upperLength = pS.distanceTo(pH);
        rest.upperLocalDir = upperArm.worldToLocal(pH.clone()).normalize();
      } else {
        rest.upperLength = 0.42;
        rest.upperLocalDir = new THREE.Vector3(0, -1, 0);
      }

      if (hand) {
        rest.handOffsetModel = model.worldToLocal(pH.clone()).sub(model.worldToLocal(pS.clone()));
      }
    }

    return { side, shoulder, upperArm, forearm, wristJoint, hand, shoulderRaven, fingers, rest };
  }

  const leftArm = resolveArmSide('left');
  const rightArm = resolveArmSide('right');

  let spear =
    findByOverride(RIG_OVERRIDES.spear) ||
    findBest([/^speargroup$/i, /gungnir/i, /spear/i, /lance/i, /halberd/i, /javelin/i, /pike/i, /polearm/i, /staff/i, /weapon/i]);

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

  // Face screen display mesh MUST be found before eyes so LedFaceDisplay is never misclassified as an eye!
  const headSearchRoot = head || model;
  let faceMeshes = findByOverride(RIG_OVERRIDES.faceMeshes) || [];
  let useFullFaceMesh = false;
  if (!faceMeshes.length) {
    const headMeshes = [];
    headSearchRoot.traverse((obj) => {
      if (!obj.isMesh) return;
      if (/horn|wing|raven|spear|gungnir|fur|collar|hair|crown|shield|rivet|occiput|lame|trim|temple|emblem|bezel|crest|saddle|cradle/i.test(obj.name)) {
        return;
      }
      headMeshes.push(obj);
    });

    const ledDisplays = headMeshes.filter((m) => /led.?face.?display|face.?display|visor|screen/i.test(m.name));
    const maskMeshes = headMeshes.filter((m) => /face.?mask|face|head.?skin|skin/i.test(m.name));
    if (ledDisplays.length) {
      faceMeshes = ledDisplays;
      useFullFaceMesh = true;
    } else if (maskMeshes.length) {
      faceMeshes = maskMeshes;
      useFullFaceMesh = true;
    } else {
      faceMeshes = headMeshes.length ? headMeshes : meshes.slice(0, 1);
      useFullFaceMesh = false;
    }
  } else {
    useFullFaceMesh = true;
  }

  const faceSet = new Set(faceMeshes);

  // Exclude raven eyes, helmet plates, and face display screen from individual eye meshes
  let eyes = findByOverride(RIG_OVERRIDES.eyes) || [];
  if (!eyes.length) {
    const rawEyes = [];
    headSearchRoot.traverse((obj) => {
      if (obj === headSearchRoot || faceSet.has(obj)) return;
      if (/raven|brow|visor|screen|display|face/i.test(obj.name)) return;
      if (/(?:eye(?!brow|lash|lid)|pupil|iris)/i.test(obj.name)) {
        rawEyes.push(obj);
      }
    });
    eyes = deduplicateRoots(rawEyes);
  }

  // Exclude armor wing plates (BrowWingPlate*) so helmet armor isn't detached
  let brows = findByOverride(RIG_OVERRIDES.brows) || [];
  if (!brows.length) {
    const rawBrows = [];
    headSearchRoot.traverse((obj) => {
      if (obj === headSearchRoot) return;
      if (/plate|wing|armor|helmet|trim/i.test(obj.name)) return;
      if (/brow|eyebrow/i.test(obj.name)) rawBrows.push(obj);
    });
    brows = deduplicateRoots(rawBrows);
  }

  const headRef = head || model;
  const excludeSpearSet = spear ? new Set([spear]) : null;
  const bodyModelBox = measureObjectBoxInSpace(model, model, excludeSpearSet) || new THREE.Box3().setFromObject(model);

  const faceBounds = { center: new THREE.Vector3(0, 0.08, 0.16), halfSize: new THREE.Vector3(0.18, 0.21, 0.16) };
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
        faceBounds.halfSize.copy(sz).multiplyScalar(0.5);
      } else {
        faceBounds.center.set(ctr.x, ctr.y + sz.y * 0.04, ctr.z + sz.z * 0.20);
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

  [head, neck, torso, legs, beard, ...eyes, ...brows].forEach(trackNode);
  [leftArm, rightArm].forEach((arm) => {
    if (!arm) return;
    [arm.shoulder, arm.upperArm, arm.forearm, arm.wristJoint, arm.hand, arm.shoulderRaven, ...arm.fingers].forEach(trackNode);
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
    legs,
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
      hasEyesOrBrows: eyes.length > 0 || brows.length > 0 || faceMeshes.length > 0,
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
        legs: legs?.name || null,
        leftArm: {
          shoulder: leftArm.shoulder?.name || null,
          upperArm: leftArm.upperArm?.name || null,
          forearm: leftArm.forearm?.name || null,
          wristJoint: leftArm.wristJoint?.name || null,
          hand: leftArm.hand?.name || null,
          shoulderRaven: leftArm.shoulderRaven?.name || null,
          fingers: leftArm.fingers.map((f) => f.name),
        },
        rightArm: {
          shoulder: rightArm.shoulder?.name || null,
          upperArm: rightArm.upperArm?.name || null,
          forearm: rightArm.forearm?.name || null,
          wristJoint: rightArm.wristJoint?.name || null,
          hand: rightArm.hand?.name || null,
          shoulderRaven: rightArm.shoulderRaven?.name || null,
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
 * Aims an arm cleanly toward a world-space hand target.
 * Supports both 2-bone (upperArm + forearm) and 1-piece shoulder-pivoted arm groups (ValhallaGuardian),
 * and stabilizes any shoulder-mounted raven so it stays perched upright.
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
  const L1 = arm.rest.upperLength || 0.42;
  const L2 = arm.rest.forearmLength || 0.24;

  const parentWorldQuatS = upper.parent.getWorldQuaternion(_q1);
  const restWorldQuatS = _q2.copy(parentWorldQuatS).multiply(restUpper.quaternion);

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
    const dirDesired = _v2.copy(targetWorldPos).sub(pShoulder);
    if (dirDesired.lengthSq() < 1e-8) dirDesired.set(0, -1, 0.3);
    dirDesired.normalize();

    const dirSE_restWorld = (arm.rest.upperLocalDir || new THREE.Vector3(0, -1, 0))
      .clone()
      .applyQuaternion(restWorldQuatS)
      .normalize();
    const deltaS = _q3.setFromUnitVectors(dirSE_restWorld, dirDesired);
    const targetWorldQuatS = deltaS.multiply(restWorldQuatS);
    const targetLocalQuatS = parentWorldQuatS.clone().invert().multiply(targetWorldQuatS);
    upper.quaternion.copy(restUpper.quaternion).slerp(targetLocalQuatS, blend);
    upper.updateMatrixWorld(true);
  }

  // Stabilize shoulder raven so it remains upright while the arm swings
  if (arm.shoulderRaven) {
    const restRaven = restPoses.get(arm.shoulderRaven);
    if (restRaven) {
      const armCurWorld = upper.getWorldQuaternion(_q4);
      const ravenRestWorld = _q5.copy(restWorldQuatS).multiply(restRaven.quaternion);
      const ravenFollowWorld = _q3.copy(armCurWorld).multiply(restRaven.quaternion);
      const desiredRavenWorld = ravenRestWorld.slerp(ravenFollowWorld, 0.22);
      const desiredRavenLocal = armCurWorld.clone().invert().multiply(desiredRavenWorld);
      arm.shoulderRaven.quaternion.copy(restRaven.quaternion).slerp(desiredRavenLocal, blend);
      arm.shoulderRaven.updateMatrixWorld(true);
    }
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
 * Procedural Cyber-Viking LED Face & Terminal Renderer.
 * Supports MeshBasicMaterial (used by LedFaceDisplay) as well as Standard/Physical materials.
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
      { prefix: '$ ', text: 'valhalla --neural-sync', color: 'orange' },
      { prefix: '0x7F ', text: 'ALLOC_MATRIX [OK]', color: 'cyan' },
      { prefix: 'fn ', text: 'decodeRunes(buf) {', color: 'orange' },
      { prefix: '  let ', text: 'k = 0xAE49 ^ ODIN;', color: 'amber' },
      { prefix: '  if ', text: 'sync > 0.99 { run(); }', color: 'orange' },
      { prefix: '>> ', text: '0x00C4  0x8E3B  0xFA12', color: 'cyan' },
      { prefix: 'exec ', text: 'bifrost --aes-gcm', color: 'orange' },
      { prefix: '0x4B ', text: 'WEIGHTS: [99.98%]', color: 'cyan' },
      { prefix: 'const ', text: 'visor = shaderPatch();', color: 'amber' },
      { prefix: '  ret ', text: 'Status::COMBAT_READY', color: 'orange' },
      { prefix: '} ', text: '// CHECK: 0x9C72A1FF', color: 'dim' },
      { prefix: '$ ', text: 'ping asgard // 0.3ms', color: 'cyan' },
    ];

    this.lines = [];
    this.cursorLineIdx = 0;
    this.charProgress = 0;
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

        const isStandard = Boolean(mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial);
        const isBasic = Boolean(mat.isMeshBasicMaterial);
        if (!isStandard && !isBasic) return mat;

        mat.customProgramCacheKey = () => `valhalla-face-display-v2-${mat.type}`;
        mat.onBeforeCompile = (shader) => {
          Object.assign(shader.uniforms, this.uniforms);

          shader.vertexShader = shader.vertexShader
            .replace(
              '#include <common>',
              `#include <common>
              uniform mat4 uValhallaHeadInv;
              varying vec3 vValhallaHeadPos;`
            )
            .replace(
              '#include <project_vertex>',
              `#include <project_vertex>
              {
                vec4 vhlWorldPos = modelMatrix * vec4( transformed, 1.0 );
                vValhallaHeadPos = ( uValhallaHeadInv * vhlWorldPos ).xyz;
              }`
            );

          let frag = shader.fragmentShader
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

              float valhallaComputeFaceMask(out vec2 faceUV, out float rimFactor) {
                vec3 safeHalf = max(uValhallaFaceHalfSize, vec3(0.001));
                vec3 rel = (vValhallaHeadPos - uValhallaFaceCenter) / safeHalf;
                vec2 visorUV = vec2(rel.x / 0.72, (rel.y - 0.04) / 0.72) * 0.5 + 0.5;
                faceUV = clamp(visorUV, 0.0, 1.0);
                rimFactor = 0.0;
                if (uValhallaCodeMix <= 0.001 && uValhallaSurpriseMix <= 0.001) return 0.0;

                float shapeMask = 1.0;
                if (uValhallaUseFullMesh < 0.5) {
                  float ovalDist = length(vec2(rel.x * 1.06, (rel.y - 0.04) * 1.02));
                  float oval = 1.0 - smoothstep(0.72, 0.96, ovalDist);
                  float zCut = smoothstep(-0.22, 0.18, rel.z);
                  shapeMask = oval * zCut;
                  rimFactor = smoothstep(0.68, 0.85, ovalDist) * (1.0 - smoothstep(0.85, 0.97, ovalDist)) * zCut;
                } else {
                  float edgeDist = max(abs(rel.x), abs(rel.y));
                  rimFactor = smoothstep(0.76, 0.96, edgeDist);
                  shapeMask = smoothstep(-0.45, 0.08, rel.z);
                }

                return clamp(shapeMask, 0.0, 1.0);
              }`
            )
            .replace(
              '#include <color_fragment>',
              `#include <color_fragment>
              vec2 vhlFaceUV = vec2(0.0);
              float vhlRim = 0.0;
              float vhlFaceMask = valhallaComputeFaceMask(vhlFaceUV, vhlRim);
              float vhlActiveMix = max(smoothstep(0.0, 0.50, uValhallaCodeMix), smoothstep(0.0, 0.35, uValhallaSurpriseMix)) * vhlFaceMask;
              if (vhlActiveMix > 0.001) {
                vec4 vhlTex = texture2D(uValhallaCodeTex, vhlFaceUV);
                float vhlScan = 0.90 + 0.10 * sin(vhlFaceUV.y * 180.0 - uValhallaTime * 8.0);
                float vhlSweepY = fract(uValhallaTime * 0.42);
                float vhlBar = exp(-abs(vhlFaceUV.y - vhlSweepY) * 24.0) * 0.30 * smoothstep(0.1, 0.9, uValhallaCodeMix);
                vec3 vhlOrange = vec3(1.0, 0.45, 0.08);
                vec3 vhlCyan = vec3(0.24, 0.92, 1.0);
                vec3 vhlScreenRgb = mix(vec3(0.010, 0.014, 0.022), vhlTex.rgb * (1.38 + 0.45 * uValhallaCodePulse) * vhlScan, 1.0)
                  + mix(vhlOrange, vhlCyan, 0.30) * vhlBar
                  + mix(vhlOrange, vhlCyan, 0.40) * vhlRim * 0.22 * smoothstep(0.1, 0.9, uValhallaCodeMix);
                diffuseColor.rgb = mix(diffuseColor.rgb, vhlScreenRgb, vhlActiveMix);
                diffuseColor.a = mix(diffuseColor.a, 1.0, vhlActiveMix);
              }`
            );

          if (isStandard) {
            frag = frag
              .replace(
                '#include <roughnessmap_fragment>',
                `#include <roughnessmap_fragment>
                if (vhlActiveMix > 0.001) {
                  roughnessFactor = mix(roughnessFactor, 0.08, vhlActiveMix);
                }`
              )
              .replace(
                '#include <metalnessmap_fragment>',
                `#include <metalnessmap_fragment>
                if (vhlActiveMix > 0.001) {
                  metalnessFactor = mix(metalnessFactor, 0.22, vhlActiveMix);
                }`
              )
              .replace(
                '#include <emissivemap_fragment>',
                `#include <emissivemap_fragment>
                if (vhlActiveMix > 0.001) {
                  vec4 vhlEmTex = texture2D(uValhallaCodeTex, vhlFaceUV);
                  totalEmissiveRadiance = mix(totalEmissiveRadiance, vec3(0.0), vhlActiveMix * 0.95)
                    + vhlEmTex.rgb * (1.35 + 0.45 * uValhallaCodePulse) * vhlActiveMix;
                }`
              );
          }

          shader.fragmentShader = frag;
        };
        mat.needsUpdate = true;
        this.patchedMaterials.push(mat);
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

    if (codeMix <= 0.01 && surpriseMix <= 0.01) return;

    this.renderAccum += dt;
    if (this.renderAccum < 1 / 26) return;
    const stepDt = this.renderAccum;
    this.renderAccum = 0;

    if (surpriseMix > codeMix) {
      this.drawSurprisedFaceCanvas(time, surpriseMix);
      this.texture.needsUpdate = true;
      return;
    }

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
      if (this.lines.length > 14) this.lines.shift();
      this.charProgress = 0;
    }

    this.drawTerminalCanvas(time, pulse);
    this.texture.needsUpdate = true;
  }

  drawSurprisedFaceCanvas(time, intensity) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Deep glossy dark LED visor background
    ctx.fillStyle = '#040912';
    ctx.fillRect(0, 0, w, h);

    const glow = ctx.createRadialGradient(w * 0.5, h * 0.45, 20, w * 0.5, h * 0.45, w * 0.55);
    glow.addColorStop(0, 'rgba(55, 230, 255, 0.14)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    const dartX = Math.sin(time * 3.1) * 8;
    const eyeY = h * 0.44;
    const leftEyeX = w * 0.34;
    const rightEyeX = w * 0.66;
    const eyeR = 44 + 8 * clamp(intensity, 0, 1);

    // High-arched surprised digital eyebrows
    ctx.strokeStyle = '#7bf5ff';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 18;
    ctx.shadowColor = 'rgba(72, 232, 255, 0.9)';

    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY - 40, 44, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(rightEyeX, eyeY - 40, 44, Math.PI * 1.18, Math.PI * 1.82);
    ctx.stroke();

    // Wide shocked cyan LED eyes
    [leftEyeX, rightEyeX].forEach((ex) => {
      ctx.fillStyle = '#5cf2ff';
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, eyeR * 0.88, eyeR * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright white-cyan ring & darting pupil
      ctx.fillStyle = '#03111c';
      ctx.beginPath();
      ctx.arc(ex + dartX, eyeY, eyeR * 0.36, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex + dartX - 7, eyeY - 8, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Cute shocked 'o' LED mouth
    ctx.strokeStyle = '#6cf4ff';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.63, 20, 26, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle exclamation/question telemetry
    ctx.fillStyle = '#ff9838';
    ctx.shadowColor = 'rgba(255, 140, 40, 0.9)';
    ctx.font = 'bold 28px ui-monospace, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('?!', w * 0.5, h * 0.25);
    ctx.textAlign = 'left';
    ctx.shadowBlur = 0;
  }

  drawTerminalCanvas(time, pulse) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = '#020306';
    ctx.fillRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(w * 0.5, h * 0.48, 12, w * 0.5, h * 0.5, w * 0.62);
    grad.addColorStop(0, `rgba(255, 110, 20, ${0.14 + pulse * 0.14})`);
    grad.addColorStop(0.55, `rgba(38, 215, 255, ${0.06 + pulse * 0.06})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 130, 45, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 40; y < h; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Safe padded viewport area so all code sits clearly inside the visible helmet visor
    const padX = 56;
    ctx.font = 'bold 16px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = '#ff8a2b';
    ctx.fillText('VALHALLA // EXEC', padX, 86);
    ctx.fillStyle = '#48e8ff';
    const hexClock = Math.floor(time * 256).toString(16).toUpperCase().padStart(4, '0');
    ctx.fillText(`0x${hexClock}`, w - padX - 66, 86);

    ctx.fillStyle = 'rgba(255, 128, 32, 0.45)';
    ctx.fillRect(padX, 98, w - padX * 2, 2);

    const startY = 136;
    const lineH = 31;
    ctx.font = 'bold 17.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

    this.lines.forEach((line, idx) => {
      const y = startY + idx * lineH;
      if (y > h - 92) return;

      if (line.flash > 0.02) {
        ctx.fillStyle = `rgba(255, 122, 24, ${line.flash * 0.24})`;
        ctx.fillRect(padX - 6, y - 20, w - padX * 2 + 12, 26);
      }

      const full = line.prefix + line.text;
      const visibleCount = Math.min(full.length, line.typed);
      const visiblePrefix = line.prefix.slice(0, Math.min(line.prefix.length, visibleCount));
      const visibleBody = line.text.slice(0, Math.max(0, visibleCount - line.prefix.length));

      ctx.shadowBlur = 10;
      ctx.shadowColor = line.color === 'cyan' ? 'rgba(60, 232, 255, 0.85)' : 'rgba(255, 118, 22, 0.9)';

      ctx.fillStyle = line.color === 'cyan' ? '#4deaff' : '#ff6b1a';
      ctx.fillText(visiblePrefix, padX, y);

      const prefixW = ctx.measureText(visiblePrefix).width;
      ctx.fillStyle =
        line.color === 'cyan'
          ? '#96f6ff'
          : line.color === 'amber'
          ? '#ffc370'
          : line.color === 'dim'
          ? '#c08556'
          : '#ff9b42';
      ctx.fillText(visibleBody, padX + prefixW, y);

      if (idx === this.lines.length - 1 && Math.floor(time * 7) % 2 === 0) {
        const totalW = prefixW + ctx.measureText(visibleBody).width;
        ctx.fillStyle = '#ff7b1c';
        ctx.fillRect(padX + 4 + totalW, y - 16, 10, 19);
      }
      ctx.shadowBlur = 0;
    });

    ctx.fillStyle = 'rgba(72, 232, 255, 0.78)';
    ctx.font = 'bold 13px ui-monospace, Menlo, monospace';
    const bars = Array.from({ length: 10 }, (_, i) => {
      const val = Math.floor((0.5 + 0.5 * Math.sin(time * 5.2 + i * 0.7)) * 255)
        .toString(16)
        .toUpperCase()
        .padStart(2, '0');
      return val;
    }).join(' ');
    ctx.fillText(bars, padX, h - 60);
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

/**
 * 1. Hand-Locked Spear Spin & Front Chest Transfer
 * The spear always stays gripped inside the moving hand(s) and both hands meet
 * cleanly in front of the chest during the transfer.
 */
function createSpearSpinAnimation() {
  return {
    id: 'spearSpin',
    label: 'Hand-Driven Spear Spin & Transfer',
    duration: 6.4,
    canPlay(rig) {
      return rig.capabilities.hasSpear && rig.capabilities.hasArms;
    },
    createState(rig) {
      const spear = rig.spear;
      const startSide = spear.restSide || 'right';
      const rightArm = rig.rightArm;
      const leftArm = rig.leftArm;

      rig.model.updateMatrixWorld(true);

      const getHandModelPos = (arm) => {
        if (arm?.hand) return rig.model.worldToLocal(arm.hand.getWorldPosition(new THREE.Vector3()));
        if (arm?.upperArm) return rig.model.worldToLocal(arm.upperArm.getWorldPosition(new THREE.Vector3()));
        return new THREE.Vector3(arm?.side === 'left' ? 0.35 : -0.35, 0.5, 0.15);
      };

      const getShoulderModelPos = (arm) => {
        if (arm?.upperArm) return rig.model.worldToLocal(arm.upperArm.getWorldPosition(new THREE.Vector3()));
        return new THREE.Vector3(arm?.side === 'left' ? 0.32 : -0.32, 0.9, 0);
      };

      const sR = getShoulderModelPos(rightArm);
      const sL = getShoulderModelPos(leftArm);
      const midX = (sR.x + sL.x) * 0.5;
      const shoulderY = (sR.y + sL.y) * 0.5;
      const shoulderZ = (sR.z + sL.z) * 0.5;
      const armLen = Math.max(rightArm?.rest?.upperLength || 0.44, leftArm?.rest?.upperLength || 0.44);

      // Hand poses relative to actual shoulders (guaranteed reachable without clipping armor!)
      const rightRestHandModel = getHandModelPos(rightArm);
      const leftRestHandModel = getHandModelPos(leftArm);
      const rightSpinHandModel = new THREE.Vector3(sR.x + 0.07, shoulderY - 0.03, shoulderZ + armLen * 0.94);
      const leftSpinHandModel = new THREE.Vector3(sL.x - 0.07, shoulderY - 0.03, shoulderZ + armLen * 0.94);
      const rightMeetHandModel = new THREE.Vector3(midX - 0.07, shoulderY - 0.02, shoulderZ + armLen * 0.88);
      const leftMeetHandModel = new THREE.Vector3(midX + 0.07, shoulderY - 0.02, shoulderZ + armLen * 0.88);
      const rightGuardHandModel = new THREE.Vector3(sR.x - 0.04, shoulderY - 0.22, shoulderZ + armLen * 0.65);
      const leftGuardHandModel = new THREE.Vector3(sL.x + 0.04, shoulderY - 0.22, shoulderZ + armLen * 0.65);

      // Compute exact rest grip anchor on spear matching RightHand's world position
      const restGripWorld = spear.localGripCenter.clone().applyMatrix4(spear.node.matrixWorld);
      const restAnchorModel =
        startSide === 'right' && rightArm?.hand
          ? rightRestHandModel.clone()
          : startSide === 'left' && leftArm?.hand
          ? leftRestHandModel.clone()
          : rig.model.worldToLocal(restGripWorld.clone());

      // Build front-facing pivot orientation so spinning around local +Z always twirls cleanly in front of the camera
      const worldShaftDir = spear.localShaftAxis.clone().transformDirection(spear.node.matrixWorld);
      const modelQuatInv = rig.model.getWorldQuaternion(new THREE.Quaternion()).invert();
      const upModel = worldShaftDir.applyQuaternion(modelQuatInv).normalize();
      const fwdModel = new THREE.Vector3(0, 0, 1);
      fwdModel.addScaledVector(upModel, -fwdModel.dot(upModel));
      if (fwdModel.lengthSq() < 1e-5) fwdModel.set(0, 0, 1);
      fwdModel.normalize();
      const rightModel = new THREE.Vector3().crossVectors(upModel, fwdModel).normalize();
      const frontBasis = new THREE.Matrix4().makeBasis(rightModel, upModel, fwdModel);
      const restPivotQuat = new THREE.Quaternion().setFromRotationMatrix(frontBasis);

      const pivot = new THREE.Group();
      pivot.name = '__ValhallaSpearAnimPivot';

      return {
        startSide,
        sR,
        sL,
        midX,
        rightRestHandModel,
        leftRestHandModel,
        rightSpinHandModel,
        leftSpinHandModel,
        rightMeetHandModel,
        leftMeetHandModel,
        rightGuardHandModel,
        leftGuardHandModel,
        restAnchorModel,
        restPivotQuat,
        pivot,
        attached: false,
      };
    },
    onEnter(rig, state) {
      const sp = rig.spear;
      rig.model.updateMatrixWorld(true);
      rig.model.add(state.pivot);
      state.pivot.position.copy(state.restAnchorModel);
      state.pivot.quaternion.copy(state.restPivotQuat);
      state.pivot.updateMatrixWorld(true);

      if (!sp.isBone) {
        state.pivot.attach(sp.node);
        state.attached = true;
      }
    },
    update(rig, state, t, dt, blend) {
      const sp = rig.spear;
      const domIsRight = state.startSide === 'right';
      const domSign = domIsRight ? -1 : 1;

      // 1. Timeline weights
      // Raise into front ready: 0.0 -> 0.85
      // Spin in dominant hand (3 crisp turns): 0.85 -> 2.55
      // Bring both hands together & pass: 2.55 -> 3.45
      // Spin in opposite hand (2 crisp turns): 3.45 -> 4.85
      // Pass back to dominant hand: 4.85 -> 5.65
      // Lower cleanly to idle: 5.65 -> 6.40
      const raiseU = smoothstep(0.0, 0.85, t);
      const returnU = smoothstep(5.60, 6.40, t);
      const stageBlend = raiseU * (1 - returnU);

      // Compute hand-to-hand transfer alpha (0 = dominant hand, 1 = opposite hand)
      let handAlpha = 0;
      if (t >= 2.75 && t < 3.35) {
        handAlpha = easeInOutCubic((t - 2.75) / 0.60);
      } else if (t >= 3.35 && t < 5.05) {
        handAlpha = 1;
      } else if (t >= 5.05 && t < 5.60) {
        handAlpha = 1 - easeInOutCubic((t - 5.05) / 0.55);
      }

      // Compute meeting blend when hands converge in front of chest for handoff
      const meet1 = smoothstep(2.35, 2.80, t) * (1 - smoothstep(3.25, 3.70, t));
      const meet2 = smoothstep(4.70, 5.10, t) * (1 - smoothstep(5.45, 5.85, t));
      const meetBlend = clamp(meet1 + meet2, 0, 1);

      // Smooth continuous cumulative spin angle ending on an exact multiple of 2*PI (5 total turns)
      const p1 = easeInOutCubic(clamp((t - 0.85) / 1.70, 0, 1)) * (Math.PI * 4);
      const passSpin = easeInOutCubic(clamp((t - 2.75) / 0.60, 0, 1)) * (Math.PI * 2);
      const p2 = easeInOutCubic(clamp((t - 3.45) / 1.40, 0, 1)) * (Math.PI * 4);
      const passBackSpin = easeInOutCubic(clamp((t - 5.05) / 0.55, 0, 1)) * (Math.PI * 2);
      const effectiveSpin = (p1 + passSpin + p2 + passBackSpin) * domSign;

      const spinVel =
        (smoothstep(0.85, 1.15, t) * (1 - smoothstep(2.30, 2.55, t))) +
        (smoothstep(3.45, 3.75, t) * (1 - smoothstep(4.65, 4.88, t)));

      // 2. Drive Left & Right Arms FIRST so hands move to exact target positions
      const rightSpinTarget = state.rightSpinHandModel.clone().lerp(state.rightMeetHandModel, meetBlend);
      const leftSpinTarget = state.leftSpinHandModel.clone().lerp(state.leftMeetHandModel, meetBlend);

      const rightTargetModel = rightSpinTarget.clone().lerp(state.rightGuardHandModel, clamp(handAlpha * (1 - meetBlend), 0, 1));
      const leftTargetModel = leftSpinTarget.clone().lerp(state.leftGuardHandModel, clamp((1 - handAlpha) * (1 - meetBlend), 0, 1));

      // Subtle circular wrist-pump on the active hand synced with the spin so arm clearly drives the twirl
      if (spinVel > 0.01) {
        const pumpX = Math.cos(effectiveSpin) * 0.022 * spinVel;
        const pumpY = Math.sin(effectiveSpin) * 0.022 * spinVel;
        if (handAlpha < 0.5) {
          rightTargetModel.x += pumpX;
          rightTargetModel.y += pumpY;
        } else {
          leftTargetModel.x += pumpX;
          leftTargetModel.y += pumpY;
        }
      }

      // Subtle grounded torso twist toward active side
      if (rig.torso) {
        const rt = rig.restPoses.get(rig.torso);
        if (rt) {
          const twist = domSign * 0.10 * (1 - handAlpha * 2) * stageBlend;
          const lean = -0.04 * stageBlend;
          _q1.setFromEuler(_e1.set(lean, twist, 0)).multiply(rt.quaternion);
          rig.torso.quaternion.copy(rt.quaternion).slerp(_q1, blend);
          if (rig.legs) {
            const rl = rig.restPoses.get(rig.legs);
            if (rl) {
              _q2.setFromEuler(_e1.set(-lean * 0.8, -twist * 0.8, 0)).multiply(rl.quaternion);
              rig.legs.quaternion.copy(rl.quaternion).slerp(_q2, blend);
            }
          }
        }
      }

      if (rig.head) {
        const rh = rig.restPoses.get(rig.head);
        if (rh) {
          const lookYaw = domSign * 0.20 * (1 - handAlpha * 2) * stageBlend;
          const lookPitch = 0.06 * stageBlend;
          _q1.setFromEuler(_e1.set(lookPitch, lookYaw, 0)).multiply(rh.quaternion);
          rig.head.quaternion.slerp(_q1, blend);
        }
      }

      const rightArmWeight = stageBlend * blend;
      const leftArmWeight = stageBlend * blend;

      if (rig.rightArm?.upperArm) {
        const rightWorld = rig.model.localToWorld(rightTargetModel.clone());
        solveArmIK(rig.rightArm, rightWorld, new THREE.Vector3(-0.5, -0.7, -0.4), rig.restPoses, rightArmWeight, 0.8);
      }
      if (rig.leftArm?.upperArm) {
        const leftWorld = rig.model.localToWorld(leftTargetModel.clone());
        solveArmIK(rig.leftArm, leftWorld, new THREE.Vector3(0.5, -0.7, -0.4), rig.restPoses, leftArmWeight, 0.8);
      }

      // Synchronized wrist motion on active hand so wrist visibly twirls the spear
      const applyWristTwirl = (arm, activeAmount) => {
        if (!arm) return;
        const wNode = arm.hand || arm.wristJoint;
        if (!wNode) return;
        const rw = rig.restPoses.get(wNode);
        if (!rw) return;
        const twirl = Math.sin(effectiveSpin) * 0.34 * activeAmount * spinVel;
        const nod = Math.cos(effectiveSpin) * 0.22 * activeAmount * spinVel;
        const lift = -0.35 * stageBlend * activeAmount;
        _q1.setFromEuler(_e1.set(lift + nod, twirl, 0)).multiply(rw.quaternion);
        wNode.quaternion.copy(rw.quaternion).slerp(_q1, blend);
      };

      applyWristTwirl(rig.rightArm, 1 - handAlpha);
      applyWristTwirl(rig.leftArm, handAlpha);

      // 3. LOCK Spear Pivot directly to the live world positions of the moving hands!
      rig.model.updateMatrixWorld(true);
      const getLiveHandModel = (arm, fallback) => {
        if (arm?.hand) return rig.model.worldToLocal(arm.hand.getWorldPosition(new THREE.Vector3()));
        return fallback.clone();
      };
      const liveRightModel = getLiveHandModel(rig.rightArm, rightTargetModel);
      const liveLeftModel = getLiveHandModel(rig.leftArm, leftTargetModel);

      const domLiveModel = domIsRight ? liveRightModel : liveLeftModel;
      const oppLiveModel = domIsRight ? liveLeftModel : liveRightModel;
      const activeGripModel = _v1.lerpVectors(domLiveModel, oppLiveModel, handAlpha);

      state.pivot.position.lerpVectors(state.restAnchorModel, activeGripModel, stageBlend * blend);

      // Tilt spin plane ~16 deg forward so spear clears helmet/ravens cleanly while held in hand
      const spinTiltQuat = _q1.setFromEuler(_e1.set(0.28 * stageBlend, 0, 0));
      const spinRollQuat = _q2.setFromAxisAngle(_v2.set(0, 0, 1), effectiveSpin);
      const animPivotQuat = state.restPivotQuat.clone().multiply(spinTiltQuat).multiply(spinRollQuat);
      state.pivot.quaternion.copy(state.restPivotQuat).slerp(animPivotQuat, blend);
      state.pivot.updateMatrixWorld(true);

      if (sp.isBone) {
        sp.node.parent.updateMatrixWorld(true);
        const parentInv = _m1.copy(sp.node.parent.matrixWorld).invert();
        const desiredWorldPos = state.pivot.getWorldPosition(_v3);
        const offsetWorld = sp.localGripCenter.clone().applyQuaternion(state.pivot.getWorldQuaternion(_q3));
        desiredWorldPos.sub(offsetWorld);
        sp.node.position.copy(desiredWorldPos.applyMatrix4(parentInv));
        const parentQuatInv = sp.node.parent.getWorldQuaternion(_q4).invert();
        sp.node.quaternion.copy(parentQuatInv.multiply(state.pivot.getWorldQuaternion(_q3)));
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

/**
 * 2. Surprised / Amazed Reaction ("Wait... What?!")
 * Moves whole TorsoGroup (with Legs counter-stabilized), preserves all armor plates,
 * drives an expressive shocked LED face on LedFaceDisplay, and raises the free hand to chin!
 */
function createSurprisedReactionAnimation() {
  return {
    id: 'surprisedReaction',
    label: 'Surprised / Amazed Reaction',
    duration: 4.3,
    canPlay() {
      return true;
    },
    createState(rig) {
      const spearSide = rig.spear?.restSide || 'right';
      const freeSide = spearSide === 'right' ? 'left' : 'right';
      const freeArm = freeSide === 'left' ? rig.leftArm : rig.rightArm;
      const sideSign = freeSide === 'left' ? 1 : -1;

      rig.model.updateMatrixWorld(true);
      let chinTargetModel = new THREE.Vector3(sideSign * 0.10, 1.05, 0.34);
      if (rig.head) {
        const hBox = measureObjectBoxInSpace(rig.head, rig.model);
        if (hBox) {
          const ctr = hBox.getCenter(new THREE.Vector3());
          const sz = hBox.getSize(new THREE.Vector3());
          chinTargetModel.set(ctr.x + sideSign * sz.x * 0.14, hBox.min.y + sz.y * 0.16, hBox.max.z - sz.z * 0.04);
        }
      }

      return { freeArm, sideSign, chinTargetModel, time: 0 };
    },
    update(rig, state, t, dt, blend, context) {
      state.time += dt;

      const shockSnap = easeOutBack(clamp(t / 0.42, 0, 1), 1.25) * (1 - easeInOutCubic(clamp((t - 3.05) / 1.10, 0, 1)));
      const handReach = easeInOutCubic(clamp((t - 0.15) / 0.65, 0, 1)) * (1 - easeInOutCubic(clamp((t - 2.95) / 0.90, 0, 1)));
      const strokeActive = smoothstep(0.80, 1.15, t) * (1 - smoothstep(2.65, 3.05, t));
      const strokeWave = Math.sin(t * 5.2) * strokeActive;

      // Head startles slightly upward with curious tilt
      if (rig.head) {
        const rh = rig.restPoses.get(rig.head);
        if (rh) {
          const pitch = (-0.15 + strokeWave * 0.025) * shockSnap;
          const yaw = (state.sideSign * -0.15 + Math.sin(t * 2.1) * 0.03) * shockSnap;
          const roll = state.sideSign * 0.10 * shockSnap;
          _q1.setFromEuler(_e1.set(pitch, yaw, roll)).multiply(rh.quaternion);
          rig.head.quaternion.slerp(_q1, blend);
        }
      }

      // Whole TorsoGroup recoils softly backward while LegsGroup keeps feet grounded
      if (rig.torso) {
        const rt = rig.restPoses.get(rig.torso);
        if (rt) {
          const leanBack = -0.055 * shockSnap;
          const twist = state.sideSign * -0.07 * shockSnap;
          _q1.setFromEuler(_e1.set(leanBack, twist, 0)).multiply(rt.quaternion);
          rig.torso.quaternion.copy(rt.quaternion).slerp(_q1, blend);
          if (rig.legs) {
            const rl = rig.restPoses.get(rig.legs);
            if (rl) {
              _q2.setFromEuler(_e1.set(-leanBack * 0.85, -twist * 0.85, 0)).multiply(rl.quaternion);
              rig.legs.quaternion.copy(rl.quaternion).slerp(_q2, blend);
            }
          }
        }
      } else if (context.modelGroup) {
        context.modelGroup.rotation.x = -0.05 * shockSnap * blend;
      }

      // Expressive face via morphs (if any) + LedFaceDisplay shocked eyes/mouth (without breaking armor!)
      const exprLevel = clamp(shockSnap * blend, 0, 1);
      for (const m of rig.morphBindings.eyeWide) m.mesh.morphTargetInfluences[m.index] = 0.95 * exprLevel;
      for (const m of rig.morphBindings.browUp) m.mesh.morphTargetInfluences[m.index] = 0.92 * exprLevel;
      for (const m of rig.morphBindings.surprise) m.mesh.morphTargetInfluences[m.index] = 0.88 * exprLevel;

      context.faceDisplay?.update(dt, state.time, 0, 0, exprLevel);

      // Free arm lifts naturally toward chin/cheek in a "Wait... what?!" gesture
      if (state.freeArm?.upperArm) {
        const targetModel = state.chinTargetModel.clone();
        targetModel.y += strokeWave * 0.020;
        targetModel.x += strokeWave * state.sideSign * 0.010;
        const targetWorld = rig.model.localToWorld(targetModel);
        solveArmIK(
          state.freeArm,
          targetWorld,
          new THREE.Vector3(state.sideSign * 0.5, -0.65, -0.5),
          rig.restPoses,
          handReach * blend,
          0.6
        );

        const wNode = state.freeArm.hand || state.freeArm.wristJoint;
        if (wNode) {
          const rw = rig.restPoses.get(wNode);
          if (rw) {
            _q1.setFromEuler(_e1.set(-0.35 * handReach, state.sideSign * 0.25 * handReach, strokeWave * 0.14)).multiply(rw.quaternion);
            wNode.quaternion.copy(rw.quaternion).slerp(_q1, blend);
          }
        }
      }
    },
    onExit(rig, state, context) {
      if (context.modelGroup) context.modelGroup.rotation.x = 0;
      context.faceDisplay?.update(0, 0, 0, 0, 0);
    },
  };
}

/**
 * 3. Holographic Coding / Hacker Mode
 * Projects glowing neon-orange & cyan terminal code directly onto LedFaceDisplay.
 */
function createCodingModeAnimation() {
  return {
    id: 'codingMode',
    label: 'Holographic Coding / Hacker Mode',
    duration: 6.6,
    canPlay(rig) {
      return rig.capabilities.hasFaceDisplay;
    },
    createState() {
      return {
        time: 0,
      };
    },
    onEnter(rig, state, context) {
      context.faceDisplay?.resetTerminal();
    },
    update(rig, state, t, dt, blend, context) {
      state.time += dt;

      const enterU = smoothstep(0.05, 0.85, t);
      const exitU = 1 - smoothstep(5.60, 6.45, t);
      const codeMix = clamp(enterU * exitU * blend, 0, 1);

      const pulsePhase = (t * 0.85) % 1;
      const pulse = Math.exp(-Math.pow((pulsePhase - 0.15) * 7.5, 2)) * 0.85 + Math.sin(t * 9.0) * 0.08 + 0.12;

      if (rig.head) {
        const rh = rig.restPoses.get(rig.head);
        if (rh) {
          const focusNod = (0.06 + Math.sin(t * 1.4) * 0.015) * codeMix;
          const microScan = Math.sin(t * 2.3) * 0.025 * codeMix;
          _q1.setFromEuler(_e1.set(focusNod, microScan, 0)).multiply(rh.quaternion);
          rig.head.quaternion.slerp(_q1, blend);
        }
      }

      context.faceDisplay?.update(dt, state.time, codeMix, pulse, 0);
    },
    onExit(rig, state, context) {
      context.faceDisplay?.update(0, 0, 0, 0, 0);
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