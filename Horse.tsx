/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/model/horse.gltf -t -r public 
*/

import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Plane: THREE.Mesh
    Plane_1: THREE.Mesh
  }
  materials: {
    horse_statue_01: THREE.MeshStandardMaterial
    horse_statue_01_base: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/model/horse.gltf') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh name="Plane" geometry={nodes.Plane.geometry} material={materials.horse_statue_01} morphTargetDictionary={nodes.Plane.morphTargetDictionary} morphTargetInfluences={nodes.Plane.morphTargetInfluences} />
      <mesh name="Plane_1" geometry={nodes.Plane_1.geometry} material={materials.horse_statue_01_base} morphTargetDictionary={nodes.Plane_1.morphTargetDictionary} morphTargetInfluences={nodes.Plane_1.morphTargetInfluences} />
    </group>
  )
}

useGLTF.preload('/model/horse.gltf')
