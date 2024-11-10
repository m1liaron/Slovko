
const createSharedGroup = (req, res) => {
try {

} catch(error) {
    res.status(500).json({ error: true, message: error.message || 'Server Error. Try again later.'})
}
}
const getAllSharedGroup = (req, res) => {
try {

} catch(error) {
    res.status(500).json({ error: true, message: error.message || 'Server Error. Try again later.'})
}
}
const getSharedGroup = (req, res) => {
try {

} catch(error) {
    res.status(500).json({ error: true, message: error.message || 'Server Error. Try again later.'})
}
}
const copySharedGroup = (req, res) => {
try {

} catch(error) {
    res.status(500).json({ error: true, message: error.message || 'Server Error. Try again later.'})
}
}

module.exports = {
    createSharedGroup,
    getAllSharedGroup,
    getSharedGroup,
    copySharedGroup,
}