import sharp from 'sharp';

const decodeJpeg = async (filePath: string) => {
    // const jpegData = readFileSync(filePath);
    // const { width, height, data } = jpeg.decode(jpegData, { useTArray: true }); // return as number[]
    const bufferData = await sharp(filePath).jpeg({quality: 100}).toBuffer()
    const arrayData = Buffer.from(bufferData).toJSON().data;

    const Req = new Blob([JSON.stringify(arrayData)]).size / (1024 * 1024);
    console.log(`Req size: ${Req} MB`);

    return arrayData;
};

export const loadCloth = async (id: string ) => {   
    const cloth = await decodeJpeg(`./public/dataset/cloth/${id}.jpg`)
    return cloth
}

export const loadHuman = async (id: string) => {
    const image = await decodeJpeg(`./public/dataset/human/${id}.jpg`)
    return image
}