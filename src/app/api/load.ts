import sharp from 'sharp';

const decodeJpeg = async (filePath: string) => {
    // const jpegData = readFileSync(filePath);
    // const { width, height, data } = jpeg.decode(jpegData, { useTArray: true }); // return as Uint8Array
    const data = sharp(filePath).jpeg({quality: 10}).toBuffer()
    return data
};

export const loadCloth = async (idx: string ) => {   
    const cloth = await decodeJpeg(`./public/dataset/cloth/${idx}.jpg`)
    return cloth
}

export const loadHuman = async (idx: string) => {
    const image = await decodeJpeg(`./public/dataset/human/${idx}.jpg`)
    return image
}