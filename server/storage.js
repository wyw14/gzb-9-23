const fs = require('fs');
const path = require('path');

const ITEMS_FILE = path.join(__dirname, 'data', 'items.json');
const EXCHANGES_FILE = path.join(__dirname, 'data', 'exchanges.json');
const BLOCKS_FILE = path.join(__dirname, 'data', 'blocks.json');

function readItems() {
  try {
    const data = fs.readFileSync(ITEMS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeItems(items) {
  fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

function readExchanges() {
  try {
    const data = fs.readFileSync(EXCHANGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeExchanges(exchanges) {
  fs.writeFileSync(EXCHANGES_FILE, JSON.stringify(exchanges, null, 2), 'utf-8');
}

function readBlocks() {
  try {
    const data = fs.readFileSync(BLOCKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeBlocks(blocks) {
  fs.writeFileSync(BLOCKS_FILE, JSON.stringify(blocks, null, 2), 'utf-8');
}

module.exports = {
  readItems,
  writeItems,
  readExchanges,
  writeExchanges,
  readBlocks,
  writeBlocks
};
