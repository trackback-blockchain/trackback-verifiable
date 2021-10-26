import { assert } from 'chai';

import { generateMnemonic, createAccount } from '../../src/agent/account'

describe('Account Tests', () => {
    it('should generate valid MNEMONIC', () => {
        const result = generateMnemonic();

        assert.typeOf(result, 'string');
    })

    it('should generate MNEMONIC 12 words', () => {
        const result = generateMnemonic(12);

        const acc = createAccount({ name: 'John', email: '' })

        assert.deepEqual(acc.keyPair.meta, { name: 'John', email: '' });
        assert.typeOf(result, 'string');
        assert.equal(result.split(' ').length, 12);
    })
})