import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('desarrol_pgobierno', 'desarrol_root', '1029384756.bds', { 
    dialect: 'mysql', 
    host: '51.81.229.13',
    define: {
        timestamps: false
    } 
});

