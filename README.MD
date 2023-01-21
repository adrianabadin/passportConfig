# Passport Mongo configurator

## Installation

´´´bash
npm install passportmongoconfigurator
´´´

## Instructions:

´´´js
import {passportConfigBuilder} from 'passportmongoconfigurator'
´´´

### On express server:

´´´js
passportConfigBuilder({address:String, name:String}).initializePassport()
´´´
