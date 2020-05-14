#!/bin/bash
echo $KAFKA_ACESS_KEY > service.key
echo $KAFKA_ACESS_CERTIFICATE > service.cert 
echo $KAFKA_CA_CERTIFICATE > ca.pem