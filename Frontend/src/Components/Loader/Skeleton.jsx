import styles from "./Skeleton.module.css";

const Skeleton = () => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.title} skeleton`} />

      <div className={styles.cards}>
        <div className={`${styles.card} skeleton`} />
        <div className={`${styles.card} skeleton`} />
        <div className={`${styles.card} skeleton`} />
      </div>

      <div className={`${styles.large} skeleton`} />
    </div>
  );
};

export default Skeleton;
