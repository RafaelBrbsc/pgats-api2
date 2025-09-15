const request = require('supertest')
const sinon = require('sinon')
const { expect } = require('chai')
const app = require('../../../rest/app')

describe('Transfer Controller', () => {
    const transferService = require('../../../src/service/transferService')
    const userService = require('../../../src/service/userService')
        
    afterEach(() => {
        sinon.restore()
    })

    describe('Transfer', () => {
        let transferMock
        let verifyTokenMock
        beforeEach(() => {
            transferMock = sinon.stub(transferService, 'transfer')
            verifyTokenMock = sinon.stub(userService, 'verifyToken')
            verifyTokenMock.returns({ user: { username: 'banks' } })
        })

        it('deve exigir from', async () => {
            const payload = { to: 'mario', amount: 100 }

            const response = await request(app)
                .post('/transfer')
                .send(payload)

            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('error', 'Remetente, destinatário e valor são obrigatórios.')
        })

        it('deve exigir to', async () => {
            const payload = { from: 'banks', amount: 100 }

            const response = await request(app)
                .post('/transfer')
                .send(payload)

            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('error', 'Remetente, destinatário e valor são obrigatórios.')
        })

        it('deve exigir amount', async () => {
            const payload = { from: 'banks', to: 'mario' }

            const response = await request(app)
                .post('/transfer')
                .send(payload)

            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('error', 'Remetente, destinatário e valor são obrigatórios.')
        })

        it('deve retornar erro caso o token seja inválido', async () => {
            const payload = { from: 'banks', to: 'mario', amount: 100 }
            verifyTokenMock.returns(null)

            const response = await request(app)
                .post('/transfer')
                .send(payload)

            expect(response.status).to.equal(403)
            expect(response.body).to.have.property('error', 'Token inválido.')
        })

        it('deve retornar erro caso a transferência seja recusada', async () => {
            const payload = { from: 'banks', to: 'mario', amount: 100 }
            transferMock.returns({ error: 'Transferência recusada.' })

            const response = await request(app)
                .post('/transfer')
                .send(payload)

            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('error', 'Transferência recusada.')
        })

        it('deve retornar mensagem de sucesso caso a transferência seja concluída', async () => {
            const payload = { from: 'banks', to: 'mario', amount: 100 }
            const transferCriada = { from: 'banks', to: 'mario', amount: 100, date: '2025-01-01' }
            transferMock.returns({ transfer: transferCriada })

            const response = await request(app)
                .post('/transfer')
                .send(payload)

            expect(response.status).to.equal(201)
            expect(response.body).to.deep.equal(transferCriada)
        })
    })



})