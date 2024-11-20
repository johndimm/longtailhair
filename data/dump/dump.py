#!/usr/local/bin/python3

def main():
  f = open ("tables.txt")
  out1 = open ("dump.sh", "w")
  out2 = open ("load.sh", "w")
  for r in f:
    r = r.strip()
    print (f"pg_dump --table {r} --schema-only > {r}.sql", file=out1)
    print (f"psql -c \"\copy {r} to '{r}.tsv' delimiter E'\\t';\"", file=out1)

    print (f"psql -f {r}.sql", file=out2)
    print (f"psql -c \"\\copy {r} from '{r}.tsv' delimiter E'\\t';\"", file=out2) 
  out1.close()
  out2.close()
  f.close()

main()
