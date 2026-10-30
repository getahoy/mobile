import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";

const BACKDROP_OPACITY = 0.3;
const OPEN_INDEX = 0;
const CLOSED_INDEX = -1;

export function SheetBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={OPEN_INDEX}
      disappearsOnIndex={CLOSED_INDEX}
      opacity={BACKDROP_OPACITY}
      pressBehavior="close"
    />
  );
}
