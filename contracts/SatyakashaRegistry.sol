// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SatyakashaRegistry {
    struct DocumentRecord {
        string documentHash;
        string ipfsCID;
        string institutionName;
        string recipientName;
        address registeredBy; // Relayer paying the gas
        uint256 timestamp;
    }

    mapping(string => bool) public isDocumentRegistered;
    mapping(string => DocumentRecord) public documents;

    event DocumentRegistered(
        string indexed documentHash,
        string ipfsCID,
        string institutionName,
        string recipientName,
        address indexed registeredBy,
        uint256 timestamp
    );

    function registerDocument(
        string memory _docHash, 
        string memory _ipfsCID, 
        string memory _institutionName, 
        string memory _recipientName
    ) public {
        require(!isDocumentRegistered[_docHash], "Document hash already registered!");

        DocumentRecord memory newDoc = DocumentRecord({
            documentHash: _docHash,
            ipfsCID: _ipfsCID,
            institutionName: _institutionName,
            recipientName: _recipientName,
            registeredBy: msg.sender,
            timestamp: block.timestamp
        });

        documents[_docHash] = newDoc;
        isDocumentRegistered[_docHash] = true;

        emit DocumentRegistered(_docHash, _ipfsCID, _institutionName, _recipientName, msg.sender, block.timestamp);
    }
}
