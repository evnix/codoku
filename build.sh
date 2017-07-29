env GOOS=darwin GOARCH=amd64 go build -o bin/codoku_darwin_amd64 codoku.go 
env GOOS=linux GOARCH=amd64 go build -o bin/codoku_linux_amd64 codoku.go 
env GOOS=windows GOARCH=amd64 go build -o bin/codoku_windows_amd64.exe codoku.go 

