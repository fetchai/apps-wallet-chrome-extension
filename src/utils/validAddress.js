import {Address} from "fetchai-ledger-api/src/fetchai/ledger/crypto";

const validAddress = (address) => {
    //todo swap to is_address when Ed updates public SDK
    try {
        new Address(address)
    } catch (e) {
        return false;
    }
    return true;
};

export {validAddress}