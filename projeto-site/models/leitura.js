'use strict';

/* 
lista e explicação dos Datatypes:
https://codewithhugo.com/sequelize-data-types-a-practical-guide/
*/

module.exports = (sequelize, DataTypes) => {
    let Evento = sequelize.define('Evento', {
        idEvento: {
            field: 'idEvento',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        data: {
            field: 'dataEvento',
            type: DataTypes.DATE,
            allowNull: false
        },
        temperatura: {
            field: 'temperaturaEvento',
            type: DataTypes.REAL,
            allowNull: false
        },
        idDomo: {
            field: 'idDomo',
            type: DataTypes.INTEGER, // NÃO existe DATETIME. O tipo DATE aqui já tem data e hora
            allowNull: false
        },
        estacao: {
            field: 'estacaoEvento',
            type: DataTypes.STRING, // campo 'falso' (não existe na tabela). Deverá ser preenchido 'manualmente' no select
            allowNull: true
        }
    }, {
        tableName: 'Evento',
        freezeTableName: true,
        underscored: true,
        timestamps: false,
    });

    return Evento;
};