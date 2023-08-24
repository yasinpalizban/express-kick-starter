import { default as i18n } from 'i18next';

export function multerRandomFileName(req, file, cb): void {
  cb(null, Math.floor(Date.now() / 1000) + '.' + file.mimetype.split('/')[1]);
}

export function multerRandomMultiPelFileName(req, file, cb): void {
  const stampTime = new Date().getTime() / 1000;
  const split = stampTime.toString().split('.');
  const join = split[0] + split[1];
  cb(null, join + '.' + file.mimetype.split('/')[1])
}

export function multerFileFilter(req, file, cb): void {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(new Error(i18n.t('api.events.fileMimiType')), false); // if validation failed then generate error
  }
}

export function multerComplexFileFilter(req, file, cb): void {
  if (file.mimetype === 'video/mp4'||file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(new Error(i18n.t('api.events.fileMimiType')), false); // if validation failed then generate error
  }
}

export function multerOnlyMp3FileFilter(req, file, cb): void {

  if (file.mimetype == 'audio/mpeg') {
    cb(null, true);
  } else {
    cb(new Error(i18n.t('api.events.fileMimiType')), false); // if validation failed then generate error
  }
}

export function multerRandomFileMp3Name(req, file, cb): void {
  cb(null, Math.floor(Date.now() / 1000) + '.mp3' );
}
