import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const rotateSpeed = 0.01;

export const Model = ({ meshRef, url }) => {
  const { scene } = useGLTF(url);

  useEffect(() => {
    const mesh = scene.children[0];
    mesh.material.transparent = true;
    mesh.material.alphaToCoverage = true;
    mesh.scale.set(0, 0, 0);

    meshRef.current = mesh;

    // Because do effect only first render
    // eslint-disable-next-line
  }, []);

  useFrame(() => {
    meshRef.current.rotation.y += rotateSpeed;
    meshRef.current.rotation.z += rotateSpeed;
  });

  return (
    <group>
      <primitive object={scene} />
    </group>
  );
};
