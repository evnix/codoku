package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

func main() {

	numbPrt := flag.String("port", "9999", "Port Number")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, r.URL.Path[1:])
	})

	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "pong")
	})

	fmt.Println("Codoku -- by Codologic pvt. ltd.")
	fmt.Println("Local Development Server running on: http://localhost:" + *numbPrt)

	log.Fatal(http.ListenAndServe(":"+*numbPrt, nil))

}
