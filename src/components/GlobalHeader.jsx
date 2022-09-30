import styles from '~/styles/components/GlobalHeader.module.scss';

export const GlobalHeader = () => {
  return (
    <>
      <h1 className={styles.logo}>
        AN EXPERIMENT
        <br />
        WITH 3D MODELs
        <br />
        IN Contentful
      </h1>

      <button className={styles.button}>menu(dummy)</button>
    </>
  );
};
