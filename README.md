# Unit.Domains App

## 1.Introduction

### The role of the DNS

In real life, each person has a mailing address, so others can use this mailing address to communicate with you. In the Internet, each device connected to the Internet has an IP address, which enables communication between devices. Inside the computer, IP addresses are stored in binary, which is difficult for people to represent and spread, so the dotted decimal and other representation methods were invented, but such digital forms are generally difficult for people to remember. So people invented the domain name system DNS (Domain Name System). For example, the domain name in the form of a string such as www.unit.domains is very convenient for people to read, write and remember. DNS is a very important service, which realizes the conversion of domain names in the form of strings that are easy to read and write into IP addresses, and facilitates people to access the Internet. DNS is a centralized management method, which is managed by the Internet Domain Name and Address Administration (ICANN) centralized organization.


### Blockchain-based DNS

In the age of Web3, people had the same problem. The address on Ethereum is an address similar to 0xc0dfe2234779296a45a3884636ACdE1cF9f54978, etc. BTC, LTC and other addresses are similar. Obviously, such addresses are not easy to read and write for humans, which requires a domain name system similar to DNS to convert domain names in the form of strings into ETH addresses. Since the ETH chain supports smart contracts, a domain name system based on ETH smart contracts can be constructed to realize the conversion between ETH addresses and domain names, and has the characteristics of decentralization, openness, and difficulty to tamper. This is how the ETH-based domain name service system appeared. At present, there are several such domain name systems, the most famous is ENS (https://ens.domains/).


### Unit Domains DNS

Unit Domains is a distributed, open and scalable Web3 domain name service system based on the Ethereum blockchain. The smart contracts and website of Unit Domains are built with reference and borrowing from the ENS (https://ens.domains/) system.

The main goal of Unit Domains is to resolve human readable and writable domain names (such as test.cat) into addresses that can be recognized by computers or Web3, such as Ethereum addresses, metadata, etc.

Similar to the DNS of the traditional Internet, Unit Domains is a hierarchical domain name system. Top-level domain names include .cat, .dag, .unit, etc. Users can create sub-domain names, such as test.cat, and continue to create the following sub-domains Domain name, such as a.test.cat, etc. Domain names between different levels are separated by decimal points.

The data of the domain name is stored on the Ethereum chain, and the management is carried out through smart contracts.

## 2.Installation

- Install Node.js,expects Node.js version >=18.12.0
- Follow the steps below to download and compile the code
```
$> git https://github.com/UnitDomains/unit-app.git 
$> cd unit-app 
$> yarn install 
$> yarn vite
```

## 3.Code description

The project uses Vue3+typescript and other technologies. The advantage of using Vue3 is that it can quickly develop projects and reduce development difficulty. Typescript can perform type checking very well,and it supports multiple features and is very suitable for developing large-scale projects.
