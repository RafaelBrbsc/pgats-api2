const request = require('supertest')
const { expect } = require('chai')

require('dotenv').config();

describe('Transfer', () => {

        let token
        before(async () => {
            const loginQuery = {
                query: `mutation Mutation { login( username: "ronaldo", password: "ronaldo" ) }`
            }
            const response = await request(process.env.URL_GRAPHQL)
                .post('')
                .send(loginQuery)
            token = response.body.data.login
        })
    
        it('deve retornar erro caso o token seja inválido', async () => {
            const payload = {
                query: `mutation Mutation { transfer( from: "banks", to: "ronaldo", amount: 100 ) { from to amount date } }`
            }

            const response = await request(process.env.URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)

            expect(response.status).to.equal(200)
            expect(response.body.errors[0]).to.have.property('message', 'Token inválido.')
        })

        it('deve retornar erro caso a transferência seja recusada', async () => {
            const payload = {
                query: `mutation Mutation { transfer( from: "ronaldo", to: "banks", amount: 10000 ) { from to amount date } }`
            }

            const response = await request(process.env.URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)

            expect(response.status).to.equal(200)
            expect(response.body.errors[0]).to.have.property('message', 'Saldo insuficiente.')
        })

        it('deve retornar mensagem de sucesso caso a transferência seja concluída', async () => {
            const payload = {
                query: `mutation Mutation { transfer( from: "ronaldo", to: "banks", amount: 100 ) { from to amount date } }`
            }

            const response = await request(process.env.URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                
            expect(response.status).to.equal(200)
            expect(response.body.data.transfer).to.have.property('from', 'ronaldo')
            expect(response.body.data.transfer).to.have.property('to', 'banks')
            expect(response.body.data.transfer).to.have.property('amount', 100)
        })

})