import Image from "next/image";

type ResponsivePhotoProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
};

export function ResponsivePhoto({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: ResponsivePhotoProps) {
  return (
    <figure className="event-photo">
      <div className="photo-wrap">
        <Image src={src} alt={alt} fill sizes={sizes} quality={68} priority={priority} className="photo-fill" />
      </div>
    </figure>
  );
}
