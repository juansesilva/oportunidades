clear;
clc;

format long;
filename='distancia_manz_raw.csv';
distancia=csvread(filename);

data=zeros(4983,276);

i=1;j=1;
while(i<4984)
    fila=distancia(j:j+275,3);
    filat=fila';
    data(i,1:276)=filat;
    i=i+1;
    j=j+276;
end

data=data*100000;


dlmwrite('fixdistance_manz_sin_virginia.csv',data,'precision','%.0f');