import styles from './Icon.module.css'

const Icon = ({ id, name, img, onOpen }) => {
  return (
    <div>
      <div
        key={id}
        className={styles.icon}
        role="button"
        tabIndex={0}
        onClick={() => onOpen?.(id)}
        onKeyDown={(e) => e.key === "Enter" && onOpen?.(id)}
      >
        <div className={styles.iconImageWrapper}>
          <img src={img} alt={name} className={styles.iconImage} />
        </div>
        <span className={styles.iconLabel}>{name}</span>
      </div>
    </div>
  );
};

export default Icon
