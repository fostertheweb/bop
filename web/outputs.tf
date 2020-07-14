output "web_build_files" {
  value = fileset("./web/build", "**")
}
