import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '~/styles/components/PageIndex.module.scss';
import { gsap } from 'gsap';
import { WebGLCanvas } from '~/components/webgl/WebGLCanvas';
import { SliderBase } from '~/lib/SliderBase';
import { SplitText } from '~/components/SplitText';

const TWEEN_PARAMS_TITLE = {
  stagger: 0.03,
  duration: 1.6,
  ease: 'power4.inOut',
};

const TWEEN_PARAMS_COUNT = {
  duration: 2,
  ease: 'power4.inOut',
};

const TWEEN_PARAMS_INFO = {
  duration: 0.6,
};

export const PageIndex = ({ posts }) => {
  const models = posts.map((post) => ({
    id: post.sys.id,
    url: post.fields.model.fields.file.url,
  }));

  const titlesRef = useRef(null);
  const infosRef = useRef(null);
  const countRef = useRef(null);

  const slideCount = posts.length;
  const sliderBase = useMemo(
    () =>
      new SliderBase({
        slideCount,
        autoplay: true,
        interval: 4000,
      }),
    [slideCount]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [beforeIndex, setBeforeIndex] = useState(0);

  const changeCurrentIndex = useCallback(() => {
    setCurrentIndex(sliderBase.current);
  }, [sliderBase]);

  useEffect(() => {
    sliderBase.on('change', changeCurrentIndex);

    return () => {
      sliderBase.removeListener('change', changeCurrentIndex);
    };

    // Because do effect only first render
    // eslint-disable-next-line
  }, []);

  const tween = useCallback(() => {
    const titleArray = titlesRef.current.children;
    const countArray = countRef.current.children;
    const infoArray = infosRef.current.children;
    if (!titleArray.length || !countArray.length || !infoArray.length) return;

    const currentTitle = titleArray[currentIndex];
    const beforeTitle = titleArray[beforeIndex];

    const currentCount = countArray[currentIndex];
    const beforeCount = countArray[beforeIndex];

    const currentInfo = infoArray[currentIndex];
    const beforeInfo = infoArray[beforeIndex];

    const tl = gsap.timeline({
      onStart: () => {
        sliderBase.sleepTimer();
      },
      onComplete: () => {
        setBeforeIndex(currentIndex);
        sliderBase.restartTimer();
      },
    });

    tl.set([currentTitle, currentCount], {
      // テキストが2つ同時に見えることになるので、先にcurrentを可視にしておく
      autoAlpha: 1,
    })
      .to(beforeTitle.children, {
        translateY: '-100%',
        ...TWEEN_PARAMS_TITLE,
      })
      .to(
        beforeCount,
        {
          translateY: '-100%',
          ...TWEEN_PARAMS_COUNT,
        },
        '<'
      )
      .to(
        beforeInfo,
        {
          autoAlpha: 0,
          ...TWEEN_PARAMS_INFO,
        },
        '>-1.4'
      )
      .set([beforeTitle, beforeCount], {
        autoAlpha: 0,
      })
      .fromTo(
        currentTitle.children,
        {
          translateY: '100%',
        },
        {
          translateY: '0',
          ...TWEEN_PARAMS_TITLE,
        },
        '>-1'
      )
      .fromTo(
        currentCount,
        {
          translateY: '100%',
        },
        {
          translateY: '0',
          ...TWEEN_PARAMS_COUNT,
        },
        '<'
      )
      .to(
        currentInfo,
        {
          autoAlpha: 1,
          ...TWEEN_PARAMS_INFO,
        },
        '>-1'
      );
  }, [sliderBase, beforeIndex, currentIndex]);

  useEffect(() => {
    // アクセス時など、current,beforeが一致しているときは実行しない
    if (currentIndex === beforeIndex) return;

    tween();

    // Because do effect only change currantNumber
    // eslint-disable-next-line
  }, [currentIndex]);

  return (
    <div className={styles.root}>
      <Head>
        <title>AN EXPERIMENT WITH 3D MODELs IN Contentful</title>
        <meta
          name="description"
          content="demo site using 3d models in contentful"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WebGLCanvas
        models={models}
        beforeIndex={beforeIndex}
        currentIndex={currentIndex}
      />

      <div ref={titlesRef} className={styles.titleWrapper}>
        {posts.map((post) => (
          <h2 className={styles.title} key={post.sys.id}>
            <SplitText text={post.fields.title} />
          </h2>
        ))}
      </div>

      <div ref={infosRef} className={styles.infoArea}>
        {posts.map((post, i) => (
          <div className={styles.info} data-index={i} key={post.sys.id}>
            <p className={styles.desc}>{post.fields.description}</p>
            <Link href="/">
              <a className={styles.link}>more</a>
            </Link>
          </div>
        ))}
      </div>

      <div className={styles.countArea}>
        <div className={styles.count}>
          <div className={styles.countCurrent}>
            <span className={styles.countZero}>0</span>
            <span ref={countRef} className={styles.countSlot}>
              {posts.map((post, i) => (
                <span key={post.sys.id}>{i + 1}</span>
              ))}
            </span>
          </div>
          <div className={styles.countSlash}>/</div>
          <div className={styles.countTotal}>0{posts.length}</div>
        </div>
      </div>

      <p className={styles.credit}>
        This is an experimental demo page
        <br />
        by @bokoko33
      </p>
    </div>
  );
};
