import { nepalLocations } from "../../appstore/nepalLocations";

const LocationSelect = ({
  id,
  name = "location",
  value,
  onChange,
  onBlur,
  className,
  placeholder = "Select a location",
  ariaLabel = "Location",
}) => (
  <select
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    aria-label={ariaLabel}
    className={className}
  >
    <option value="">{placeholder}</option>
    {value && !nepalLocations.includes(value) && (
      <option value={value}>{value}</option>
    )}
    {nepalLocations.map((location) => (
      <option key={location} value={location}>
        {location}
      </option>
    ))}
  </select>
);

export default LocationSelect;
