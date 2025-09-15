const request = require('supertest')
const { expect } = require('chai')

require('dotenv').config();

describe('Transfer', () => {

        let token
        before(async () => {
            const response = await request(process.env.URL_REST)
                .post('/login')
                .send({ username: 'ronaldo', password: 'ronaldo' })
            token = response.body.token
        })
    
        it('deve retornar erro caso o token seja inválido', async () => {
            const payload = { from: 'banks', to: 'ronaldo', amount: 100 }

            const response = await request(process.env.URL_REST)
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)

            expect(response.status).to.equal(403)
            expect(response.body).to.have.property('error', 'Token inválido.')
        })

        it('deve retornar erro caso a transferência seja recusada', async () => {
            const payload = { from: 'ronaldo', to: 'banks', amount: 10000 }

            const response = await request(process.env.URL_REST)
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)

            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('error', 'Saldo insuficiente.')
        })

        it('deve retornar mensagem de sucesso caso a transferência seja concluída', async () => {
            const payload = { from: 'ronaldo', to: 'banks', amount: 100 }

            const response = await request(process.env.URL_REST)
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                
            expect(response.status).to.equal(201)
            expect(response.body).to.have.property('from', 'ronaldo')
            expect(response.body).to.have.property('to', 'banks')
            expect(response.body).to.have.property('amount', 100)
        })

})