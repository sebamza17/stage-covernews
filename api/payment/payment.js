import mongodb from 'mongodb';
import {success, failure} from './libs/response-lib';
import {getConnection} from './libs/mongodb-connect';
import AWS from 'aws-sdk';
import request from 'request';

const s3 = new AWS.S3();

/**
 * Get last articles
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export function get (event, context, callback) {

    

};

