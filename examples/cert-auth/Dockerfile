FROM alpine:3.18.4

RUN apk add --no-cache openssl

RUN mkdir -p /opt/rootca/output
WORKDIR /opt/rootca

ENV CERT__COUNTRY_NAME="US"
ENV CERT__STATE_NAME="Kansas"
ENV CERT__LOCALITY="Oz"
ENV CERT__ORG="Acme Co."
ENV CERT__ORG_UNIT="IT"
ENV DAYS_UNTIL_EXPIRATION=3650
# Should be overwritten by User
ENV CERT__DOMAIN="home.lan"
ENV CERT__FILENAME="site"
ENV CERT__IP=""
ENV CERT__IP_RANGE=""

RUN touch ./gen.sh; chmod +x ./gen.sh
# NOTE: Escape env. variables that aren't used at build-time. 
RUN cat <<EOF > ./gen.sh
#!/bin/sh

echo ""
echo "Using:"
echo "  CERT__DOMAIN   : '\${CERT__DOMAIN}'"
echo "  CERT__FILENAME : '\${CERT__FILENAME}'"
if [ "\$CERT__IP" != "" ]; then
  echo "  CERT__IP       : '\${CERT__IP}'"
  IP_EXT=",IP:\${CERT__IP}"
elif [ "\$CERT__IP_RANGE" != "" ]; then
  echo "  CERT__IP_RANGE : '\${CERT__IP_RANGE}'"
  
  ipPrefix=\${CERT__IP_RANGE%.*} 
  range=\${CERT__IP_RANGE##*.}
  num1="\$(echo "\$range" | cut -d'-' -f1)"
  num2="\$(echo "\$range" | cut -d'-' -f2)"
  
  # echo "\${ipPrefix} | \${num1} | \${num2}"
  
  IP_EXT=""
  for i in \$(seq \$num1 \$num2); do
    IP_EXT="\${IP_EXT},IP:\${ipPrefix}.\${i}"
  done
fi
echo ""

openssl req -x509 -newkey rsa:4096 -sha256 \
  -days 3650 \
  -nodes -keyout "./output/\${CERT__FILENAME}.key" \
  -out "./output/\${CERT__FILENAME}.crt" \
  -subj "/CN=\${CERT__DOMAIN}" \
  -addext "subjectAltName=DNS:\${CERT__DOMAIN},DNS:*.\${CERT__DOMAIN}\${IP_EXT}"

echo ""
echo "[CRT OUTPUT]"
openssl x509 -in "./output/\${CERT__FILENAME}.crt" -text -noout

EOF

CMD ["./gen.sh"]
