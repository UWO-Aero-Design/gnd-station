let alt_offset = 0;

const get = () => {
    return alt_offset;
}

const set = (offset) => {
    alt_offset = offset;
}


module.exports = {
    get,
    set
};