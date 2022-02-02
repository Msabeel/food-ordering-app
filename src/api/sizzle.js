import axios from 'axios';

const BASEURL = 'http://admin.sizzlefoods.ca/public/';
export default axios.create(
    {
        baseURL: 'http://admin.sizzlefoods.ca/public/api'
        // baseURL:'https://api.sizzle.sadathussain.com/public/api/'
    }
)