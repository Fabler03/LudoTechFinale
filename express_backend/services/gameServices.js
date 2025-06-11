const fs = require('fs');
const path = require('path');
const Game = require('../models/game');
const archiver = require('archiver')

class GameService {
  static async uploadGame({ name, description, author, isAdmin, files }) {
    const uploadPath = path.join(__dirname, '../uploads', name);

    fs.mkdirSync(uploadPath, { recursive: true });

    // sposta i file da temp alla cartella finale
    const moveFile = (file, folder) => {
      const oldPath = file.path;
      const newPath = path.join(folder, file.filename);
      fs.renameSync(oldPath, newPath);
      return file.filename;
    };

    const savedFiles = {
      html: moveFile(files.html[0], uploadPath),
      css: moveFile(files.css[0], uploadPath),
      js: moveFile(files.js[0], uploadPath),
      icon: moveFile(files.icon[0], uploadPath)
    };

    // carica i file nel db
    const newGame = await Game.create({
      name,
      description,
      author,
      isAdmin,
      files: savedFiles
    });

    return newGame;
  }

  static async prepareGameZip(gameId) {
    const game = await Game.findById(gameId, true);
    if (!game) {
      throw new Error('Gioco non trovato');
    }

    const folderPath = path.join(__dirname, '..', 'uploads', game.name);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.directory(folderPath, false);
    
    return { archive, gameName: game.name };
  }


  static async uploadScore(userId, gameId, score) {
    return await Game.createScore(userId, gameId, score);
  }

  static async getGameScores(gameId) {
    return await Game.getGameScores(gameId);
  }

  static async deleteGame(id) {
    const game = await Game.findById(id, true);
    if (!game) {
      throw new Error('Gioco non trovato');
    }
    const uploadPath = path.join(__dirname, '../uploads', game.name);
    fs.rmdirSync(uploadPath, { recursive: true });
    await Game.deleteById(id);
    return { success: true, message: 'Gioco cancellato con successo' };
  }

  static async approveGame(id, approvedby) {
    return await Game.approve(id, approvedby);
s  }

  static async getGameById(id, isAdmin) {
    return await Game.findById(id, isAdmin);
  }

  static async listApprovedGames() {
    return await Game.getApproved();
  }

  static async listUnapprovedGames() {
    return await Game.getUnapproved();
  }
}

module.exports = GameService;