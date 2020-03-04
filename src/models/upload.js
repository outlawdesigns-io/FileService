"use strict";

const Record = require('outlawdesigns.io.noderecord');

class Upload extends Record{

  constructor(id){
    const database = 'FileService';
    const table = 'Upload';
    const primaryKey = 'id';
    super(database,table,primaryKey,id);
    this.publicKeys = [
      'id',
      'created_date',
      'file_path',
      'url',
      'userId',
    ];
  }
}


module.exports = Upload;
