import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { scale } from '@cloudinary/url-gen/actions/resize';

export default function CDNImage({
  src,
  width,
  alt,
}: {
  src: string;
  width: number;
  alt?: string;
}) {
  const cloudinaryImage = new CloudinaryImage(src, {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
  })
    .setDeliveryType('fetch')
    .resize(scale().width(width));

  return <AdvancedImage cldImg={cloudinaryImage} alt={alt} plugins={[lazyload()]} />;
}
