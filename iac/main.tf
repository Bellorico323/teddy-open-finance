resource "aws_security_group" "ec2_sg" {
  name        = "ec2-security-group"
  description = "Security group for instance EC2"
  
  tags = {
    Name = "ec2-security-group"
    Iac  = true
  }
}

resource "aws_security_group_rule" "http_ingress" {
  type              = "ingress"
  security_group_id = aws_security_group.ec2_sg.id
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]  # Permite o tráfego de qualquer IP
}


resource "aws_security_group_rule" "ssh_ingress" {
  type              = "ingress"
  security_group_id = aws_security_group.ec2_sg.id
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "allow_all_egress" {
  type              = "egress"
  security_group_id = aws_security_group.ec2_sg.id
  from_port         = 0
  to_port           = 0
  protocol          = "-1" # todos os protocolos
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = var.ec2_public_key
}

resource "aws_instance" "ec2" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.ec2_sg.name]

  tags = {
    Name = "Teddy Open Finance"
    Iac  = true
  }
}
