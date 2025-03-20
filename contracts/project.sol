// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarbonOffsetToken {
    struct OffsetProject {
        uint256 id;
        string name;
        address creator;
        uint256 totalTokens;
        uint256 tokensIssued;
    }
    
    mapping(uint256 => OffsetProject) public projects;
    mapping(address => mapping(uint256 => uint256)) public userTokens;
    uint256 public nextProjectId;
    
    event ProjectCreated(uint256 id, string name, address creator, uint256 totalTokens);
    event TokensIssued(uint256 projectId, address recipient, uint256 amount);

    function createProject(string memory name, uint256 totalTokens) public {
        projects[nextProjectId] = OffsetProject(nextProjectId, name, msg.sender, totalTokens, 0);
        emit ProjectCreated(nextProjectId, name, msg.sender, totalTokens);
        nextProjectId++;
    }

    function issueTokens(uint256 projectId, address recipient, uint256 amount) public {
        OffsetProject storage project = projects[projectId];
        require(msg.sender == project.creator, "Only project creator can issue tokens");
        require(project.tokensIssued + amount <= project.totalTokens, "Not enough tokens available");

        project.tokensIssued += amount;
        userTokens[recipient][projectId] += amount;
        
        emit TokensIssued(projectId, recipient, amount);
    }
}
