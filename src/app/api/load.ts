import { decodeJpeg } from '@/util/image';

export const loadCloth = async (id: string ) => {   
    const cloth = await decodeJpeg(`./public/dataset/cloth/${id}.jpg`)
    return cloth
}

export const loadHuman = async (id: string) => {
    const image = await decodeJpeg(`./public/dataset/human/${id}.jpg`)
    return image
}