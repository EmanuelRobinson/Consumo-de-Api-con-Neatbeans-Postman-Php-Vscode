package com.empresa.service;

import com.empresa.model.Usuario;
import com.empresa.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository repo;

    public UsuarioService(UsuarioRepository repo) {
        this.repo = repo;
    }

    public List<Usuario> listar() {
        return repo.findAll();
    }

    public Usuario guardar(Usuario u) {
        return repo.save(u);
    }

    public Usuario obtener(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Usuario actualizar(Long id, Usuario nuevo) {
        return repo.findById(id).map(usuarioExistente -> {
            usuarioExistente.setNombre(nuevo.getNombre());
            usuarioExistente.setEmail(nuevo.getEmail());
           
            return repo.save(usuarioExistente);
        }).orElse(null);
    }

    public void eliminar(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
        }
 
    }
}