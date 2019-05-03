FROM mongo

COPY artists_init.json events_init.json ./
#  mongoimport --host <host_name> --username <user_name> --password <password> --db <database_name> --collection <collection_name> --file <input_file>
CMD mongoimport --host db --db nodeSoundscape --collection artists --type json --file /artists_init.json --jsonArray \
&& mongoimport --host db --db nodeSoundscape --collection events --type json --file /events_init.json --jsonArray
