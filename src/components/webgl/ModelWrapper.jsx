import { useCallback, useEffect, useRef, createRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { gsap } from 'gsap';
import { Model } from '~/components/webgl/Model';

const SCALE_HIDE = 0;
const SCALE_ACTIVE = 1;
const SCALE_FADE = 1.6;
const EASE = 'power4.out';

export const ModelWrapper = ({ models, beforeIndex, currentIndex }) => {
  const meshesRef = useRef(
    [...Array(models.length)].map(() => createRef(null))
  );

  const { progress } = useProgress();
  const [isLoaded, setIsLoaded] = useState(false);

  const tween = useCallback(() => {
    const currentModel = meshesRef?.current[currentIndex]?.current;
    const beforeModel = meshesRef?.current[beforeIndex]?.current;

    if (!currentModel || !beforeModel) return;

    const tl = gsap.timeline({ delay: 0.6 });
    tl.fromTo(
      beforeModel.scale,
      {
        x: SCALE_ACTIVE,
        y: SCALE_ACTIVE,
        z: SCALE_ACTIVE,
      },
      {
        x: SCALE_FADE,
        y: SCALE_FADE,
        z: SCALE_FADE,
        duration: 2,
        ease: EASE,
      }
    )
      .to(
        beforeModel.material,
        {
          opacity: 0,
          duration: 2,
          ease: EASE,
        },
        '<'
      )
      .to(
        currentModel.scale,
        {
          x: SCALE_ACTIVE,
          y: SCALE_ACTIVE,
          z: SCALE_ACTIVE,
          duration: 2,
          ease: EASE,
        },
        '<+1'
      )
      .set(beforeModel.scale, {
        x: SCALE_HIDE,
        y: SCALE_HIDE,
        z: SCALE_HIDE,
      })
      .set(beforeModel.material, {
        opacity: 1,
      });
  }, [meshesRef, beforeIndex, currentIndex]);

  useEffect(() => {
    // アクセス時など、current,beforeが一致しているときは実行しない
    if (currentIndex === beforeIndex) return;

    tween();

    // Because do effect only change currantNumber
    // eslint-disable-next-line
  }, [currentIndex]);

  // first model tween
  useEffect(() => {
    if (progress === 100) setIsLoaded(true);
  }, [progress]);

  useEffect(() => {
    if (!isLoaded) return;

    const firstModel = meshesRef?.current[0]?.current;
    const tween = gsap.to(firstModel.scale, {
      x: SCALE_ACTIVE,
      y: SCALE_ACTIVE,
      z: SCALE_ACTIVE,
      duration: 2,
      ease: EASE,
    });

    return () => {
      tween?.kill();
    };
  }, [isLoaded]);

  return models.map((model, i) => (
    <Model
      key={model.id}
      meshRef={meshesRef.current[i]}
      url={model.url}
      index={i}
    />
  ));
};
