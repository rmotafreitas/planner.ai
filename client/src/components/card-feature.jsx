// eslint-disable-next-line react/prop-types
export function CardFeature({ title, description, Icon }) {
  return (
    <div className="flex flex-col gap-4 justify-start items-start w-64">
      <Icon />
      <h3 className="text-2xl">{title}</h3>
      <p className="text-xl">{description}</p>
    </div>
  );
}
