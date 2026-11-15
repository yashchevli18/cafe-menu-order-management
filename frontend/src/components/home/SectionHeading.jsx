const SectionHeading = ({ eyebrow, title, description, action, align = 'left', light = false }) => (
  <div
    className={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}
  >
    <div className={align === 'center' ? 'max-w-2xl' : 'max-w-xl'}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className={`mt-2 text-3xl font-semibold sm:text-4xl ${light ? 'text-cream' : 'text-espresso'}`}>{title}</h2>
      {description && (
        <p className={`mt-3 leading-relaxed ${light ? 'text-cream/70' : 'text-espresso/65'}`}>{description}</p>
      )}
    </div>
    {action}
  </div>
);

export default SectionHeading;
