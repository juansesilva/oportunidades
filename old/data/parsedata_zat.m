clear;
clc;

format long;
filename='distancia_zats_raw.csv';
distancia=csvread(filename);

data=zeros(98,276);

i=1;j=1;
while(i<277)
    fila=distancia(j:j+97,3);

    data(1:98,i)=fila;
    i=i+1;
    j=j+98;
end

data=data*100000;


dlmwrite('fixdistance_zat.csv',data,'precision','%.0f');