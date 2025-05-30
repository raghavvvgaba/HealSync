

const SidebarItem = ({ icon: Icon , title, description }) => {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary hover:bg-primary transition">
      {Icon && <Icon className="text-text mt-1" />}
      <div>
        <h3 className="text-accent font-semibold">{title}</h3>
        <p className="text-text text-sm">{description}</p>
      </div>
    </div>
  );
};

export default SidebarItem;
