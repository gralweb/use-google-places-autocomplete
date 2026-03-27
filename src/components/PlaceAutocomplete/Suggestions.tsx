import type { PlaceResult } from "./types";

interface SuggestionsProps {
  predictions: PlaceResult[];
  onSelectPlace: (prediction: PlaceResult) => void;
  selected: {
    index: number;
    setIndex: (index: number) => void;
  };
  listClassName?: string;
}

export const Suggestions = ({
  predictions,
  onSelectPlace,
  selected,
  listClassName,
}: SuggestionsProps) => {
  return (
    <ul className={`place-autocomplete-list ${listClassName || ""}`}>
      {predictions.map((prediction, index) => (
        <li
          key={prediction.placeId}
          className={`place-autocomplete-item ${
            index === selected.index ? "place-autocomplete-item-selected" : ""
          }`}
          onClick={() => onSelectPlace(prediction)}
          onMouseEnter={() => selected.setIndex(index)}
        >
          <div className="place-autocomplete-item-main">
            {prediction.mainText}
          </div>
          {prediction.secondaryText && (
            <div className="place-autocomplete-item-secondary">
              {prediction.secondaryText}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
