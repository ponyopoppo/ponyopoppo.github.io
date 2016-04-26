import os
import sys

def parse(file_name):
    f = open(file_name)
    ewt = "none"
    ncs = False

    points = []
    for line in f:
        line = line.strip()
        if line == "": continue
        if line.startswith("EDGE_WEIGHT_TYPE"):
            ewt = line.split(':')[1].strip()            
        if ncs and line != "EOF":
            lst = line.split(' ')
            (i, x, y) = filter(lambda x: x != "", lst)
            points.append((i, x, y))
            
        if line == "NODE_COORD_SECTION":
            ncs = True

    f.close()
    if len(points) == 0: return
    
    f = open(file_name.split('.')[0] + ".in", 'w')
    f.write(str(len(points)) + "\n")
    for p in points:
        f.write(str(p[1]) + " " + str(p[2]) + "\n")

    f.close()

if __name__ == "__main__":
    for file_name in sys.argv[1:]:
        parse(file_name)
        
    
