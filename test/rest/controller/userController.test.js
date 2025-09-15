const request = require('supertest')
const sinon = require('sinon')
const { expect } = require('chai')
const app = require('../../../rest/app')

describe('User Controller', () => {
    const userService = require('../../../src/service/userService')
    
    afterEach(() => {
        sinon.restore()
    })

    describe('Register', () => {
        let registerMock
        beforeEach(() => {
            registerMock = sinon.stub(userService, 'registerUser')
        })

        it('deve exigir username', async () => {
            const payload = { password: 'password123' }

            const response = await request(app)
                .post('/register')
                .send(payload)

            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('error', 'Usuário e senha são obrigatórios.')
        })

        it('deve exigir password', async () => {
            const payload = { username: 'username123' }

            const response = await request(app)
                .post('/register')
                .send(payload)

            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('error', 'Usuário e senha são obrigatórios.')
        })

        it('deve permitir cadastrar usuário que ainda não existe', async () => {
            const payload = { username: 'username123', password: 'password123' }
            const userCriado = { username: 'username123', password: 'password123', favorecido: false, balance: 0 }
            registerMock.returns(userCriado)

            const response = await request(app)
                .post('/register')
                .send(payload)

            console.log(response)

            expect(response.status).to.equal(201)
            expect(response.body).to.deep.equal(userCriado)
        })

        it('deve bloquear cadastrar usuário que já existe', async () => {
            const payload = { username: 'username123', password: 'password123' }
            const error = { error: 'Usuário já existe.' }
            registerMock.returns(error)

            const response = await request(app)
                .post('/register')
                .send(payload)

            expect(response.status).to.equal(409)
            expect(response.body).to.deep.equal(error)
        })
    })

    describe('Login', () => {
        let loginMock
        beforeEach(() => {
            loginMock = sinon.stub(userService, 'loginUser')
        })

        it('deve exigir username', async () => {
            const payload = { password: 'password123' }

            const response = await request(app)
                .post('/login')
                .send(payload)

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Usuário e senha são obrigatórios.')
        })

        it('deve exigir password', async () => {
            const payload = { username: 'username123' }

            const response = await request(app)
                .post('/login')
                .send(payload)

            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('error', 'Usuário e senha são obrigatórios.')
        })

        it('deve permitir logar usuário com credenciais válidas', async () => {
            const payload = { username: 'username123', password: 'password123' }
            const token = 'mockToken123'
            loginMock.returns(token)

            const response = await request(app)
                .post('/login')
                .send(payload)

            expect(response.status).to.equal(200)
            expect(response.body).to.equal(token)
        })

        it('deve bloquear logar usuário com credenciais inválidas', async () => {
            const payload = { username: 'username123', password: 'password123' }
            const error = { error: 'Credenciais inválidas.' }
            loginMock.returns(error)

            const response = await request(app)
                .post('/login')
                .send(payload)

            expect(response.status).to.equal(401)
            expect(response.body).to.deep.equal(error)
        })
    })
})