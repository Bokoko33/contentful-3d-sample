import { Suspense } from 'react';
import styles from '~/styles/components/WebGLCanvas.module.scss';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ModelWrapper } from '~/components/webgl/ModelWrapper';

export const WebGLCanvas = ({ models, beforeIndex, currentIndex }) => {
  return (
    <div className={styles.root}>
      <Canvas style={{ pointerEvents: 'none' }}>
        <directionalLight />
        <ambientLight intensity={0.5} />
        <OrbitControls />
        <Suspense>
          <ModelWrapper
            models={models}
            beforeIndex={beforeIndex}
            currentIndex={currentIndex}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
