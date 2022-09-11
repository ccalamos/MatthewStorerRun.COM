import { Ref } from "preact";

export function Image(
  props: { top: number; left: number; ref: Ref<HTMLImageElement> },
) {
  return (
    <img
      ref={props.ref}
      class={`top-[${props.top}] left-[${props.left}] h-48 w-48`}
      src="https://ccucougars.com/images/2022/8/29/_M_XC-TF_Matthew_Storer.jpg?width=300"
    />
  );
}
